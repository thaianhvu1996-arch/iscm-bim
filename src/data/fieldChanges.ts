import type { BlockId, Discipline, FieldChange, FieldChangeStatus } from '../types'
import type { Lang } from '../i18n/LanguageContext'
import { PROJECT_START, CURRENT_DATE } from './constants'
import { SITE_TEAM, BIM_TEAM, DESIGN_TEAM, namesOf } from './people'
import { createRng, pick, pickWeighted, randInt, chance, addDays, daysBetween } from '../utils/random'

const rng = createRng(730214)

const REASONS: Array<Record<Lang, string>> = [
  { vi: 'Yêu cầu chủ đầu tư', en: 'Investor request' },
  { vi: 'Điều kiện thực tế hiện trường', en: 'Actual site conditions' },
  { vi: 'Phát hiện xung đột khi thi công', en: 'Clash discovered during construction' },
  { vi: 'Thay đổi quy chuẩn PCCC', en: 'Fire-protection code change' },
  { vi: 'Tối ưu biện pháp thi công', en: 'Construction-method optimization' },
  { vi: 'Sai lệch khảo sát địa chất', en: 'Geotechnical survey discrepancy' },
]

const AXIS_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const axis = () => `${pick(rng, AXIS_LETTERS)}-${randInt(rng, 1, 24)}`

interface TemplateResult {
  text: Record<Lang, string>
  discipline: Discipline
  reason: Record<Lang, string>
}

type Template = (block: BlockId) => TemplateResult

const TEMPLATES: Template[] = [
  (b) => ({
    text: {
      vi: `Tăng tĩnh không cửa cuốn Block ${b} từ 6,0m lên 6,5m để phù hợp xe container 45ft`,
      en: `Increase the Block ${b} roller-shutter clearance from 6.0m to 6.5m to fit 45ft containers`,
    },
    discipline: 'Kiến trúc', reason: REASONS[0],
  }),
  (_b) => {
    const ax = axis()
    return {
      text: {
        vi: `Điều chỉnh vị trí móng cột trục ${ax} do sai lệch khảo sát địa chất thực tế`,
        en: `Adjust the column footing position at grid ${ax} due to a geotechnical survey discrepancy`,
      },
      discipline: 'Kết cấu', reason: REASONS[5],
    }
  },
  (b) => ({
    text: {
      vi: `Điều chỉnh vị trí trạm biến áp Block ${b} do xung đột với tuyến ống cấp nước ngoài nhà`,
      en: `Relocate the Block ${b} transformer station due to a clash with the outdoor water supply route`,
    },
    discipline: 'MEP', reason: REASONS[2],
  }),
  (b) => ({
    text: {
      vi: `Bổ sung cửa thoát hiểm khu văn phòng Block ${b} theo yêu cầu thẩm duyệt PCCC`,
      en: `Add an emergency exit in the Block ${b} office area per fire-protection approval requirements`,
    },
    discipline: 'Kiến trúc', reason: REASONS[3],
  }),
  (b) => ({
    text: {
      vi: `Thay đổi vật liệu lợp mái Block ${b} từ tôn 1 lớp sang tôn cách nhiệt 3 lớp (PU)`,
      en: `Change the Block ${b} roofing material from single-layer sheet to 3-layer PU insulated sheet`,
    },
    discipline: 'Kiến trúc', reason: REASONS[0],
  }),
  (b) => {
    const mm = randInt(rng, 100, 300)
    return {
      text: {
        vi: `Điều chỉnh cao độ nền xưởng Block ${b} tăng thêm ${mm}mm do khảo sát địa hình thực tế`,
        en: `Raise the Block ${b} warehouse floor level by an additional ${mm}mm based on the actual topographic survey`,
      },
      discipline: 'Kết cấu', reason: REASONS[1],
    }
  },
  (_b) => {
    const ax = axis()
    return {
      text: {
        vi: `Thay đổi tuyến ống PCCC trục ${ax} để né tránh dầm chính sau khi phát hiện xung đột`,
        en: `Reroute the fire-protection pipe at grid ${ax} to avoid the main beam after a clash was found`,
      },
      discipline: 'MEP', reason: REASONS[2],
    }
  },
  (b) => ({
    text: {
      vi: `Điều chỉnh hướng tuyến thoát nước mưa khu vực giáp ranh Block ${b} do cao độ san nền thực tế`,
      en: `Adjust the stormwater drainage route direction at the Block ${b} boundary area based on actual grading levels`,
    },
    discipline: 'Hạ tầng', reason: REASONS[1],
  }),
  (b) => ({
    text: {
      vi: `Bổ sung hệ thống chữa cháy tự động (sprinkler) khu vực kho gần Block ${b} theo yêu cầu thẩm duyệt PCCC`,
      en: `Add an automatic sprinkler system in the storage area near Block ${b} per fire-protection approval requirements`,
    },
    discipline: 'MEP', reason: REASONS[3],
  }),
  (b) => ({
    text: {
      vi: `Thay đổi biện pháp thi công móng cọc ép sang cọc khoan nhồi khu vực Block ${b} do địa chất yếu`,
      en: `Switch the foundation method from driven piles to bored piles in the Block ${b} area due to weak soil`,
    },
    discipline: 'Kết cấu', reason: REASONS[5],
  }),
  (b) => {
    const m = randInt(rng, 1, 3)
    return {
      text: {
        vi: `Điều chỉnh vị trí cửa cuốn container Block ${b} lùi vào ${m}m để đảm bảo bán kính quay xe`,
        en: `Set the Block ${b} container roller shutter back ${m}m to secure the truck turning radius`,
      },
      discipline: 'Kiến trúc', reason: REASONS[4],
    }
  },
  (b) => ({
    text: {
      vi: `Tăng công suất trạm biến áp Block ${b} từ 1000 kVA lên 1250 kVA theo yêu cầu mở rộng phụ tải`,
      en: `Increase the Block ${b} transformer capacity from 1000 kVA to 1250 kVA per the load-expansion request`,
    },
    discipline: 'MEP', reason: REASONS[0],
  }),
  (_b) => {
    const ax = axis()
    return {
      text: {
        vi: `Gia cường kết cấu thép mái khu vực lắp đặt quạt hút công nghiệp trục ${ax}`,
        en: `Reinforce the roof steel structure at grid ${ax} where the industrial exhaust fan is installed`,
      },
      discipline: 'Kết cấu', reason: REASONS[2],
    }
  },
  (b) => ({
    text: {
      vi: `Mở rộng bán kính bo cua đường nội bộ khu vực cổng Block ${b} để xe container ra vào thuận tiện`,
      en: `Widen the internal-road turning radius at the Block ${b} gate area for easier container-truck access`,
    },
    discipline: 'Hạ tầng', reason: REASONS[0],
  }),
  (b) => ({
    text: {
      vi: `Đổi vị trí phòng kỹ thuật điện Block ${b} sang đầu hồi đối diện do vướng lối xe nâng`,
      en: `Move the Block ${b} electrical room to the opposite end wall due to a conflict with the forklift aisle`,
    },
    discipline: 'Kiến trúc', reason: REASONS[1],
  }),
  (b) => ({
    text: {
      vi: `Bổ sung tủ điện phân phối dự phòng khu văn phòng Block ${b} theo yêu cầu chủ đầu tư`,
      en: `Add a standby distribution panel in the Block ${b} office area per the investor's request`,
    },
    discipline: 'MEP', reason: REASONS[0],
  }),
  (_b) => {
    const ax = axis()
    const mm = randInt(rng, 100, 400)
    return {
      text: {
        vi: `Điều chỉnh khoảng cách lưới cột trục ${ax} thêm ${mm}mm để tối ưu bố trí kệ hàng cho khách thuê`,
        en: `Adjust the column grid spacing at ${ax} by an additional ${mm}mm to optimize tenant racking layout`,
      },
      discipline: 'Kết cấu', reason: REASONS[0],
    }
  },
  (b) => ({
    text: {
      vi: `Bổ sung hố ga tách rác trước khi vào hệ thống xử lý nước mưa khu vực Block ${b}`,
      en: `Add a debris-separation manhole ahead of the stormwater treatment system in the Block ${b} area`,
    },
    discipline: 'Hạ tầng', reason: REASONS[4],
  }),
  (b) => ({
    text: {
      vi: `Thay đổi vị trí miệng gió hồi khu văn phòng Block ${b} để tránh trùng đèn âm trần`,
      en: `Relocate the return-air grille in the Block ${b} office area to avoid clashing with recessed ceiling lights`,
    },
    discipline: 'MEP', reason: REASONS[2],
  }),
  (b) => ({
    text: {
      vi: `Bổ sung mái che khu vực bãi tập kết vật tư ngoài trời gần Block ${b}`,
      en: `Add a canopy over the outdoor material-staging yard near Block ${b}`,
    },
    discipline: 'Kiến trúc', reason: REASONS[4],
  }),
]

const IMPACT_POOL: Array<Record<Lang, string>> = [
  { vi: 'Không thay đổi khối lượng', en: 'No quantity change' },
  { vi: '+8 triệu đồng vật tư', en: '+VND 8 million materials' },
  { vi: '+35 triệu đồng vật tư', en: '+VND 35 million materials' },
  { vi: '+120 triệu đồng vật tư', en: '+VND 120 million materials' },
  { vi: '-2% khối lượng đào đắp khu vực liên quan', en: '-2% earthworks quantity in the affected area' },
  { vi: '+15 md tuyến ống', en: '+15 lm of pipe route' },
  { vi: '+80 md tuyến ống', en: '+80 lm of pipe route' },
  { vi: '+2 cửa thoát hiểm', en: '+2 emergency exits' },
  { vi: '+1 tủ điện phân phối', en: '+1 distribution panel' },
  { vi: 'Tăng khoảng 5% khối lượng thép mái khu vực liên quan', en: 'About +5% roof steel quantity in the affected area' },
  { vi: 'Không phát sinh chi phí', en: 'No additional cost' },
  { vi: '+45 triệu đồng nhân công điều chỉnh', en: '+VND 45 million adjustment labor' },
]

const BLOCK_WEIGHTS: Array<[BlockId, number]> = [
  ['A', 30],
  ['B', 28],
  ['C', 24],
  ['D', 18],
]

const REPORTERS = namesOf(SITE_TEAM.concat(BIM_TEAM, DESIGN_TEAM))
const SPAN_DAYS = daysBetween(PROJECT_START, CURRENT_DATE)
const TOTAL_CHANGES = 60

function generateFieldChanges(): FieldChange[] {
  const list: FieldChange[] = []
  for (let i = 0; i < TOTAL_CHANGES; i++) {
    const block = pickWeighted(rng, BLOCK_WEIGHTS)
    const template = pick(rng, TEMPLATES)
    const { text, discipline, reason } = template(block)
    const dayOffset = randInt(rng, 4, Math.max(5, SPAN_DAYS - 1))
    const date = addDays(PROJECT_START, dayOffset)
    const modelStatus: FieldChangeStatus = chance(rng, 0.85) ? 'Đã cập nhật' : 'Chờ cập nhật'

    list.push({
      id: `TD-${String(i + 1).padStart(3, '0')}`,
      date,
      block,
      discipline,
      description: text,
      reason,
      reporter: pick(rng, REPORTERS),
      modelStatus,
      quantityImpact: pick(rng, IMPACT_POOL),
    })
  }
  return list.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export const fieldChanges: FieldChange[] = generateFieldChanges()
