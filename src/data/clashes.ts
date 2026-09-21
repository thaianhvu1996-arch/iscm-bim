import type { BlockId, Clash, ClashComment, ClashStatus, ClashSeverity, Discipline } from '../types'
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
  text: string
  da: Discipline
  db: Discipline
  elevation: string
}

type Template = (block: BlockId) => TemplateResult

const TEMPLATES: Template[] = [
  (_block) => {
    const size = pick(rng, DUCT_SIZES)
    const beam = beamCode()
    const elev = pick(rng, ROOF_ELEVATIONS.concat(MID_ELEVATIONS))
    return {
      text: `Ống gió ${size} xuyên qua dầm chính ${beam} trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, PCCC_PIPE_SIZES)
    const target = pick(rng, [`cột thép ${columnCode()}`, `dầm phụ ${beamCode()}`])
    const elev = pick(rng, MID_ELEVATIONS.concat(LOW_ELEVATIONS))
    return {
      text: `Ống nước PCCC ${size} va chạm ${target} tại trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (block) => {
    const elev = pick(rng, MID_ELEVATIONS)
    return {
      text: `Máng cáp điện chạm hệ ống sprinkler tại hành lang kỹ thuật Block ${block}, cao độ ${elev}`,
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, DUCT_SIZES)
    const tray = pick(rng, CABLE_TRAY_SIZES)
    const elev = pick(rng, MID_ELEVATIONS.concat(ROOF_ELEVATIONS))
    return {
      text: `Ống gió ${size} chạm máng cáp điện ${tray} tại trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, DUCT_SIZES)
    const truss = trussCode()
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: `Miệng gió hồi ${size} va chạm vì kèo mái ${truss} tại trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, WATER_PIPE_SIZES)
    const fd = foundationCode()
    const elev = pick(rng, LOW_ELEVATIONS)
    return {
      text: `Đường ống cấp thoát nước ${size} xuyên qua đài móng ${fd} tại trục ${axis()}`,
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const col = columnCode()
    const mm = randInt(rng, 80, 350)
    const elev = pick(rng, LOW_ELEVATIONS)
    return {
      text: `Cửa cuốn container trục ${axis()} vướng cột thép ${col}, lệch ${mm}mm so với tim thiết kế`,
      da: 'Kiến trúc', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const tray = pick(rng, CABLE_TRAY_SIZES)
    const size = pick(rng, DUCT_SIZES)
    const elev = pick(rng, MID_ELEVATIONS)
    return {
      text: `Thang cáp điện chính ${tray} chồng lên ống gió cấp ${size} tại trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: `Đèn chiếu sáng nhà xưởng (highbay) va chạm giằng mái tại trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (_block) => {
    const size = pick(rng, WATER_PIPE_SIZES)
    const beam = beamCode()
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: `Ống thoát nước mái ${size} xuyên qua dầm biên ${beam} tại trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (block) => {
    const elev = pick(rng, LOW_ELEVATIONS)
    return {
      text: `Vị trí lắp đặt tủ điện phân phối ${dbCode(block)} lấn vào chiều rộng lối thoát hiểm hành lang kỹ thuật Block ${block}`,
      da: 'MEP', db: 'Kiến trúc', elevation: elev,
    }
  },
  (block) => {
    const size = pick(rng, PCCC_PIPE_SIZES)
    const elev = pick(rng, MID_ELEVATIONS)
    return {
      text: `Đường ống PCCC ${size} trùng tuyến với ống đồng điều hòa tại trần kỹ thuật Block ${block}, cao độ ${elev}`,
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: `Xà gồ mái đâm xuyên hộp kỹ thuật MEP (MEP box) tại trục ${axis()}, cao độ ${elev}`,
      da: 'Kết cấu', db: 'MEP', elevation: elev,
    }
  },
  (block) => {
    const size = pick(rng, SITE_PIPE_SIZES)
    return {
      text: `Tuyến ống cấp nước ngoài nhà ${size} chồng tuyến cáp điện ngầm trung thế tại khu vực giáp ranh Block ${block}`,
      da: 'Hạ tầng', db: 'Hạ tầng', elevation: '+0.000',
    }
  },
  (block) => {
    const hg = `HG-${randInt(rng, 1, 40)}`
    return {
      text: `Hố ga thoát nước mưa ${hg} trùng vị trí móng cột đèn chiếu sáng sân bãi khu vực Block ${block}`,
      da: 'Hạ tầng', db: 'Hạ tầng', elevation: '+0.000',
    }
  },
  (block) => {
    return {
      text: `Trục kỹ thuật đứng (shaft) MEP đụng dầm sàn tầng 2 khu văn phòng Block ${block}, tại trục ${axis()}`,
      da: 'MEP', db: 'Kết cấu', elevation: '+4.500',
    }
  },
  (block) => {
    const beam = beamCode()
    return {
      text: `Dầm phụ ${beam} hạ cao độ đáy dầm vướng trần thạch cao khu văn phòng Block ${block}, tại trục ${axis()}`,
      da: 'Kết cấu', db: 'Kiến trúc', elevation: '+3.300',
    }
  },
  (_block) => {
    const p1 = pick(rng, WATER_PIPE_SIZES)
    const p2 = pick(rng, WATER_PIPE_SIZES)
    const elev = pick(rng, LOW_ELEVATIONS.concat(MID_ELEVATIONS))
    return {
      text: `Đường ống thoát nước thải ${p1} chồng tuyến ống cấp nước sạch ${p2} tại trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'MEP', elevation: elev,
    }
  },
  (_block) => {
    const elev = pick(rng, ROOF_ELEVATIONS)
    return {
      text: `Quạt hút công nghiệp lắp mái vướng hệ xà gồ mái tại trục ${axis()}, cao độ ${elev}`,
      da: 'MEP', db: 'Kết cấu', elevation: elev,
    }
  },
  (block) => {
    return {
      text: `Rãnh thoát nước sân bãi xung đột với bậc tam cấp lối vào khu văn phòng Block ${block}`,
      da: 'Hạ tầng', db: 'Kiến trúc', elevation: '+0.000',
    }
  },
]

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

const COMMENTS_OPEN = [
  'Đã ghi nhận xung đột, chuyển bộ môn liên quan kiểm tra.',
  'Đang chờ phương án điều chỉnh từ tư vấn thiết kế.',
  'Đã trao đổi với đội thi công, chờ xác nhận phương án xử lý.',
  'Đã họp phối hợp bộ môn, đang so sánh 2 phương án né tránh.',
]
const COMMENTS_RESOLVED = [
  'Đã cập nhật lại mô hình theo phương án điều chỉnh, xung đột được xử lý.',
  'Điều chỉnh cao độ tuyến ống, đã xác nhận hết xung đột trên mô hình.',
  'Thống nhất phương án né tránh với các bộ môn liên quan, đã đóng xung đột.',
  'Đã thi công theo phương án điều chỉnh, kiểm tra thực tế khớp mô hình.',
  'Dịch chuyển tuyến ống/máng cáp sang vị trí mới, đã nghiệm thu nội bộ.',
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
      message: 'Phát hiện xung đột qua kiểm tra mô hình tổng hợp (model liên kết 4 bộ môn).',
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
      message: 'Đánh giá mức độ ảnh hưởng không đáng kể, thống nhất bỏ qua không xử lý.',
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
