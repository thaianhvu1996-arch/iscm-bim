import type { BlockId, Clash, ClashComment, ClashStatus, ClashSeverity, Discipline } from '../types'
import type { Lang } from '../i18n/LanguageContext'
import { PROJECT_START, CURRENT_DATE } from './constants'
import { BIM_TEAM, SITE_TEAM, namesOf } from './people'
import {
  createRng,
  pick,
  pickWeighted,
  randInt,
  randFloat,
  addDays,
  daysBetween,
  clamp,
} from '../utils/random'
import { BLOCK_LAYOUT, parseElevation } from '../utils/geometry'

const rng = createRng(9182732)

const AXIS_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const DUCT_SIZES = ['D200', 'D250', 'D300', 'D350', 'D400', 'D500', 'D600', 'D800']
const PCCC_PIPE_SIZES = ['DN65', 'DN80', 'DN100', 'DN125', 'DN150', 'DN200']
const WATER_PIPE_SIZES = ['DN50', 'DN75', 'DN110', 'DN150', 'DN200']
const SITE_PIPE_SIZES = ['D100', 'D150', 'D200', 'D250']
const CABLE_TRAY_SIZES = ['100x50', '200x100', '300x100', '400x100', '500x150', '600x150']
const ROOF_ELEVATIONS = ['+7.200', '+8.400', '+9.800', '+10.500', '+12.000']
const MID_ELEVATIONS = ['+4.500', '+5.400', '+6.000', '+7.200']
const LOW_ELEVATIONS = ['+0.000', '+0.450', '+1.200']

const axis = () => `${pick(rng, AXIS_LETTERS)}-${randInt(rng, 1, 24)}`
const columnCode = () => `C-${randInt(rng, 1, 60)}`
const beamCode = () => `D${pick(rng, ['C', 'P'])}-${randInt(rng, 1, 40)}`
const trussCode = () => `VK-${randInt(rng, 1, 40)}`
const foundationCode = () => `M-${randInt(rng, 1, 60)}`
const dbCode = (block: BlockId) => `DB-${block}${randInt(rng, 1, 12)}`

interface TemplateResult {
  text: Record<Lang, string>
  da: Discipline
  db: Discipline
  elevation: string
}

type Template = (block: BlockId) => TemplateResult

const TEMPLATES: Template[] = [
  (_block) => {
    const size = pick(rng, DUCT_SIZES)
    const beam = beamCode()
    const ax = axis()
    const elev = pick(rng, ROOF_ELEVATIONS.concat(MID_ELEVATIONS))
    return {
      text: {
        vi: `Ống gió ${size} xuyên qua dầm chính ${beam} trục ${ax}, cao độ ${elev}`,
        en: `${size} duct penetrates main beam ${beam} at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, PCCC_PIPE_SIZES)
    const useColumn = chance50()
    const col = columnCode()
    const beam = beamCode()
    const ax = axis()
    const elev = pick(rng, MID_ELEVATIONS.concat(LOW_ELEVATIONS))
    const targetVi = useColumn ? `cột thép ${col}` : `dầm phụ ${beam}`
    const targetEn = useColumn ? `steel column ${col}` : `secondary beam ${beam}`
    return {
      text: {
        vi: `Ống nước PCCC ${size} va chạm ${targetVi} tại trục ${ax}, cao độ ${elev}`,
        en: `${size} fire-protection pipe clashes with ${targetEn} at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (block) => {
    const elev = pick(rng, MID_ELEVATIONS)
    return {
      text: {
        vi: `Máng cáp điện chạm hệ ống sprinkler tại hành lang kỹ thuật Block ${block}, cao độ ${elev}`,
        en: `Cable tray clashes with the sprinkler pipe system in the Block ${block} technical corridor, elevation ${elev}`,
      },
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, DUCT_SIZES)
    const tray = pick(rng, CABLE_TRAY_SIZES)
    const ax = axis()
    const elev = pick(rng, MID_ELEVATIONS.concat(ROOF_ELEVATIONS))
    return {
      text: {
        vi: `Ống gió ${size} chạm máng cáp điện ${tray} tại trục ${ax}, cao độ ${elev}`,
        en: `${size} duct clashes with ${tray} cable tray at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, DUCT_SIZES)
    const truss = trussCode()
    const ax = axis()
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: {
        vi: `Miệng gió hồi ${size} va chạm vì kèo mái ${truss} tại trục ${ax}, cao độ ${elev}`,
        en: `${size} return air grille clashes with roof truss ${truss} at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, WATER_PIPE_SIZES)
    const fd = foundationCode()
    const ax = axis()
    const elev = pick(rng, LOW_ELEVATIONS)
    return {
      text: {
        vi: `Đường ống cấp thoát nước ${size} xuyên qua đài móng ${fd} tại trục ${ax}`,
        en: `${size} water supply/drainage pipe penetrates footing ${fd} at grid ${ax}`,
      },
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const col = columnCode()
    const mm = randInt(rng, 80, 350)
    const ax = axis()
    const elev = pick(rng, LOW_ELEVATIONS)
    return {
      text: {
        vi: `Cửa cuốn container trục ${ax} vướng cột thép ${col}, lệch ${mm}mm so với tim thiết kế`,
        en: `Container roller shutter at grid ${ax} fouls steel column ${col}, offset ${mm}mm from the design centerline`,
      },
      da: 'Kiến trúc', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const tray = pick(rng, CABLE_TRAY_SIZES)
    const size = pick(rng, DUCT_SIZES)
    const ax = axis()
    const elev = pick(rng, MID_ELEVATIONS)
    return {
      text: {
        vi: `Thang cáp điện chính ${tray} chồng lên ống gió cấp ${size} tại trục ${ax}, cao độ ${elev}`,
        en: `Main cable ladder ${tray} overlaps supply duct ${size} at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const ax = axis()
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: {
        vi: `Đèn chiếu sáng nhà xưởng (highbay) va chạm giằng mái tại trục ${ax}, cao độ ${elev}`,
        en: `Warehouse highbay light clashes with roof bracing at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, WATER_PIPE_SIZES)
    const beam = beamCode()
    const ax = axis()
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: {
        vi: `Ống thoát nước mái ${size} xuyên qua dầm biên ${beam} tại trục ${ax}, cao độ ${elev}`,
        en: `${size} roof drain pipe penetrates edge beam ${beam} at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (block) => {
    const elev = pick(rng, LOW_ELEVATIONS)
    const db = dbCode(block)
    return {
      text: {
        vi: `Vị trí lắp đặt tủ điện phân phối ${db} lấn vào chiều rộng lối thoát hiểm hành lang kỹ thuật Block ${block}`,
        en: `Distribution panel ${db} location encroaches on the emergency-exit width of the Block ${block} technical corridor`,
      },
      da: 'MEP', db: 'Kiến trúc', elevation: elev,
    }
  },
  (block) => {
    const size = pick(rng, PCCC_PIPE_SIZES)
    const elev = pick(rng, MID_ELEVATIONS)
    return {
      text: {
        vi: `Đường ống PCCC ${size} trùng tuyến với ống đồng điều hòa tại trần kỹ thuật Block ${block}, cao độ ${elev}`,
        en: `${size} fire-protection pipe overlaps the AC copper piping route in the Block ${block} technical ceiling, elevation ${elev}`,
      },
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const ax = axis()
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: {
        vi: `Xà gồ mái đâm xuyên hộp kỹ thuật MEP (MEP box) tại trục ${ax}, cao độ ${elev}`,
        en: `Roof purlin pierces the MEP box at grid ${ax}, elevation ${elev}`,
      },
      da: 'Kết cấu', db: 'MEP', elevation: elev,
    }
  },
  (block) => {
    const size = pick(rng, SITE_PIPE_SIZES)
    return {
      text: {
        vi: `Tuyến ống cấp nước ngoài nhà ${size} chồng tuyến cáp điện ngầm trung thế tại khu vực giáp ranh Block ${block}`,
        en: `${size} outdoor water supply line overlaps the underground medium-voltage cable route at the Block ${block} boundary area`,
      },
      da: 'Hạ tầng', db: 'Hạ tầng', elevation: '+0.000',
    }
  },
  (block) => {
    const hg = `HG-${randInt(rng, 1, 40)}`
    return {
      text: {
        vi: `Hố ga thoát nước mưa ${hg} trùng vị trí móng cột đèn chiếu sáng sân bãi khu vực Block ${block}`,
        en: `Stormwater manhole ${hg} coincides with a yard light-pole footing in the Block ${block} area`,
      },
      da: 'Hạ tầng', db: 'Hạ tầng', elevation: '+0.000',
    }
  },
  (block) => {
    const ax = axis()
    return {
      text: {
        vi: `Trục kỹ thuật đứng (shaft) MEP đụng dầm sàn tầng 2 khu văn phòng Block ${block}, tại trục ${ax}`,
        en: `MEP vertical shaft clashes with the level-2 floor beam in the Block ${block} office area, at grid ${ax}`,
      },
      da: 'MEP', db: 'Kết cấu', elevation: '+4.500',
    }
  },
  (block) => {
    const beam = beamCode()
    const ax = axis()
    return {
      text: {
        vi: `Dầm phụ ${beam} hạ cao độ đáy dầm vướng trần thạch cao khu văn phòng Block ${block}, tại trục ${ax}`,
        en: `Secondary beam ${beam}, with a lowered soffit level, fouls the gypsum ceiling in the Block ${block} office area, at grid ${ax}`,
      },
      da: 'Kết cấu', db: 'Kiến trúc', elevation: '+3.300',
    }
  },
  (_block) => {
    const p1 = pick(rng, WATER_PIPE_SIZES)
    const p2 = pick(rng, WATER_PIPE_SIZES)
    const ax = axis()
    const elev = pick(rng, LOW_ELEVATIONS.concat(MID_ELEVATIONS))
    return {
      text: {
        vi: `Đường ống thoát nước thải ${p1} chồng tuyến ống cấp nước sạch ${p2} tại trục ${ax}, cao độ ${elev}`,
        en: `${p1} wastewater pipe overlaps ${p2} clean-water supply pipe at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const ax = axis()
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: {
        vi: `Quạt hút công nghiệp lắp mái vướng hệ xà gồ mái tại trục ${ax}, cao độ ${elev}`,
        en: `Roof-mounted industrial exhaust fan fouls the roof purlin system at grid ${ax}, elevation ${elev}`,
      },
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (block) => {
    return {
      text: {
        vi: `Rãnh thoát nước sân bãi xung đột với bậc tam cấp lối vào khu văn phòng Block ${block}`,
        en: `Yard drainage channel clashes with the entrance steps of the Block ${block} office area`,
      },
      da: 'Hạ tầng', db: 'Kiến trúc', elevation: '+0.000',
    }
  },
]

function chance50(): boolean {
  return rng() < 0.5
}

const SEVERITY_WEIGHTS: Array<[ClashSeverity, number]> = [
  ['A', 15],
  ['B', 40],
  ['C', 45],
]
const COST_RANGES: Record<ClashSeverity, [number, number]> = {
  A: [150_000_000, 450_000_000],
  B: [40_000_000, 150_000_000],
  C: [8_000_000, 40_000_000],
}
const BLOCK_WEIGHTS: Array<[BlockId, number]> = [
  ['A', 34],
  ['B', 29],
  ['C', 22],
  ['D', 15],
]

const ASSIGNEES = namesOf(BIM_TEAM.concat(SITE_TEAM))
const BIM_NAMES = namesOf(BIM_TEAM)
const FOLLOWUP_NAMES = namesOf(SITE_TEAM.concat(BIM_TEAM))

const COMMENTS_OPEN: Array<Record<Lang, string>> = [
  {
    vi: 'Đã ghi nhận xung đột, chuyển bộ môn liên quan kiểm tra.',
    en: 'Clash logged and forwarded to the relevant discipline for review.',
  },
  {
    vi: 'Đang chờ phương án điều chỉnh từ tư vấn thiết kế.',
    en: 'Awaiting a revised solution from the design consultant.',
  },
  {
    vi: 'Đã trao đổi với đội thi công, chờ xác nhận phương án xử lý.',
    en: 'Discussed with the site team, awaiting confirmation of the resolution approach.',
  },
  {
    vi: 'Đã họp phối hợp bộ môn, đang so sánh 2 phương án né tránh.',
    en: 'Held a coordination meeting with the disciplines, comparing two avoidance options.',
  },
]
const COMMENTS_RESOLVED: Array<Record<Lang, string>> = [
  {
    vi: 'Đã cập nhật lại mô hình theo phương án điều chỉnh, xung đột được xử lý.',
    en: 'Model updated per the revised solution; the clash is resolved.',
  },
  {
    vi: 'Điều chỉnh cao độ tuyến ống, đã xác nhận hết xung đột trên mô hình.',
    en: 'Adjusted the pipe route elevation; confirmed clear of clashes on the model.',
  },
  {
    vi: 'Thống nhất phương án né tránh với các bộ môn liên quan, đã đóng xung đột.',
    en: 'Agreed on an avoidance solution with the relevant disciplines; clash closed.',
  },
  {
    vi: 'Đã thi công theo phương án điều chỉnh, kiểm tra thực tế khớp mô hình.',
    en: 'Built per the revised solution; on-site check matches the model.',
  },
  {
    vi: 'Dịch chuyển tuyến ống/máng cáp sang vị trí mới, đã nghiệm thu nội bộ.',
    en: 'Relocated the pipe/cable-tray route; internally accepted.',
  },
]

function generateComments(
  status: ClashStatus,
  reporter: string,
  detectedDate: Date,
): ClashComment[] {
  const comments: ClashComment[] = [
    {
      author: reporter,
      date: detectedDate,
      message: {
        vi: 'Phát hiện xung đột qua kiểm tra mô hình tổng hợp (model liên kết 4 bộ môn).',
        en: 'Clash detected during federated model review (4-discipline linked model).',
      },
    },
  ]
  if (status === 'Đang xử lý' || status === 'Đã xử lý') {
    comments.push({
      author: pick(rng, BIM_NAMES),
      date: addDays(detectedDate, randInt(rng, 1, 5)),
      message: pick(rng, COMMENTS_OPEN),
    })
  }
  if (status === 'Đã xử lý') {
    comments.push({
      author: pick(rng, FOLLOWUP_NAMES),
      date: addDays(detectedDate, randInt(rng, 6, 20)),
      message: pick(rng, COMMENTS_RESOLVED),
    })
  }
  if (status === 'Bỏ qua') {
    comments.push({
      author: pick(rng, BIM_NAMES),
      date: addDays(detectedDate, randInt(rng, 1, 5)),
      message: {
        vi: 'Đánh giá mức độ ảnh hưởng không đáng kể, thống nhất bỏ qua không xử lý.',
        en: 'Assessed as low impact; agreed to leave unresolved.',
      },
    })
  }
  return comments
}

function randomPositionInBlock(block: BlockId, elevation: string) {
  const layout = BLOCK_LAYOUT[block]
  const margin = 6
  const x = randFloat(rng, layout.x0 + margin, layout.x0 + layout.width - margin, 1)
  const z = randFloat(rng, layout.z0 + margin, layout.z0 + layout.depth - margin, 1)
  const y = clamp(parseElevation(elevation), 0.3, 13)
  return { x, y, z }
}

const TOTAL_CLASHES = 340
const SPAN_DAYS = daysBetween(PROJECT_START, CURRENT_DATE)

function generateClashes(): Clash[] {
  const list: Clash[] = []
  for (let i = 0; i < TOTAL_CLASHES; i++) {
    const block = pickWeighted(rng, BLOCK_WEIGHTS)
    const template = pick(rng, TEMPLATES)
    const { text, da, db, elevation } = template(block)
    const severity = pickWeighted(rng, SEVERITY_WEIGHTS)
    const [minCost, maxCost] = COST_RANGES[severity]
    const estimatedCost = Math.round(randFloat(rng, minCost, maxCost, 0) / 1_000_000) * 1_000_000

    const detectedOffset = randInt(rng, 5, Math.max(6, SPAN_DAYS - 2))
    const detectedDate = addDays(PROJECT_START, detectedOffset)
    const dueDate = addDays(detectedDate, randInt(rng, 7, 21))

    const statusRoll = rng()
    let status: ClashStatus
    if (statusRoll < 0.72) status = 'Đã xử lý'
    else if (statusRoll < 0.89) status = 'Đang xử lý'
    else if (statusRoll < 0.97) status = 'Mới'
    else status = 'Bỏ qua'

    let resolvedDate: Date | null = null
    if (status === 'Đã xử lý') {
      const maxResolve = Math.max(3, Math.min(daysBetween(detectedDate, CURRENT_DATE), 30))
      resolvedDate = addDays(detectedDate, randInt(rng, 2, maxResolve))
    }

    const reporter = pick(rng, ASSIGNEES)
    const assignee = pick(rng, ASSIGNEES)

    list.push({
      id: `XD-${String(i + 1).padStart(4, '0')}`,
      description: text,
      disciplineA: da,
      disciplineB: db,
      block,
      elevation,
      severity,
      estimatedCost,
      status,
      assignee,
      detectedDate,
      dueDate,
      resolvedDate,
      comments: generateComments(status, reporter, detectedDate),
      position: randomPositionInBlock(block, elevation),
    })
  }
  return list
}

export const clashes: Clash[] = generateClashes()
