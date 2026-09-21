import type { BlockId, Discipline, FieldChange, FieldChangeStatus } from '../types'
import { PROJECT_START, CURRENT_DATE } from './constants'
import { SITE_TEAM, BIM_TEAM, DESIGN_TEAM, namesOf } from './people'
import { createRng, pick, pickWeighted, randInt, chance, addDays, daysBetween } from '../utils/random'

const rng = createRng(730214)

const REASONS = [
  'Yêu cầu chủ đầu tư',
  'Điều kiện thực tế hiện trường',
  'Phát hiện xung đột khi thi công',
  'Thay đổi quy chuẩn PCCC',
  'Tối ưu biện pháp thi công',
  'Sai lệch khảo sát địa chất',
] as const

const AXIS_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const axis = () => `${pick(rng, AXIS_LETTERS)}-${randInt(rng, 1, 24)}`

interface TemplateResult {
  text: string
  discipline: Discipline
  reason: string
}

type Template = (block: BlockId) => TemplateResult

const TEMPLATES: Template[] = [
  (b) => ({
    text: `Tăng tĩnh không cửa cuốn Block ${b} từ 6,0m lên 6,5m để phù hợp xe container 45ft`,
    discipline: 'Kiến trúc', reason: REASONS[0],
  }),
  (_b) => ({
    text: `Điều chỉnh vị trí móng cột trục ${axis()} do sai lệch khảo sát địa chất thực tế`,
    discipline: 'Kết cấu', reason: REASONS[5],
  }),
  (b) => ({
    text: `Điều chỉnh vị trí trạm biến áp Block ${b} do xung đột với tuyến ống cấp nước ngoài nhà`,
    discipline: 'MEP', reason: REASONS[2],
  }),
  (b) => ({
    text: `Bổ sung cửa thoát hiểm khu văn phòng Block ${b} theo yêu cầu thẩm duyệt PCCC`,
    discipline: 'Kiến trúc', reason: REASONS[3],
  }),
  (b) => ({
    text: `Thay đổi vật liệu lợp mái Block ${b} từ tôn 1 lớp sang tôn cách nhiệt 3 lớp (PU)`,
    discipline: 'Kiến trúc', reason: REASONS[0],
  }),
  (b) => ({
    text: `Điều chỉnh cao độ nền xưởng Block ${b} tăng thêm ${randInt(rng, 100, 300)}mm do khảo sát địa hình thực tế`,
    discipline: 'Kết cấu', reason: REASONS[1],
  }),
  (_b) => ({
    text: `Thay đổi tuyến ống PCCC trục ${axis()} để né tránh dầm chính sau khi phát hiện xung đột`,
    discipline: 'MEP', reason: REASONS[2],
  }),
  (b) => ({
    text: `Điều chỉnh hướng tuyến thoát nước mưa khu vực giáp ranh Block ${b} do cao độ san nền thực tế`,
    discipline: 'Hạ tầng', reason: REASONS[1],
  }),
  (b) => ({
    text: `Bổ sung hệ thống chữa cháy tự động (sprinkler) khu vực kho gần Block ${b} theo yêu cầu thẩm duyệt PCCC`,
    discipline: 'MEP', reason: REASONS[3],
  }),
  (b) => ({
    text: `Thay đổi biện pháp thi công móng cọc ép sang cọc khoan nhồi khu vực Block ${b} do địa chất yếu`,
    discipline: 'Kết cấu', reason: REASONS[5],
  }),
  (b) => ({
    text: `Điều chỉnh vị trí cửa cuốn container Block ${b} lùi vào ${randInt(rng, 1, 3)}m để đảm bảo bán kính quay xe`,
    discipline: 'Kiến trúc', reason: REASONS[4],
  }),
  (b) => ({
    text: `Tăng công suất trạm biến áp Block ${b} từ 1000 kVA lên 1250 kVA theo yêu cầu mở rộng phụ tải`,
    discipline: 'MEP', reason: REASONS[0],
  }),
  (_b) => ({
    text: `Gia cường kết cấu thép mái khu vực lắp đặt quạt hút công nghiệp trục ${axis()}`,
    discipline: 'Kết cấu', reason: REASONS[2],
  }),
  (b) => ({
    text: `Mở rộng bán kính bo cua đường nội bộ khu vực cổng Block ${b} để xe container ra vào thuận tiện`,
    discipline: 'Hạ tầng', reason: REASONS[0],
  }),
  (b) => ({
    text: `Đổi vị trí phòng kỹ thuật điện Block ${b} sang đầu hồi đối diện do vướng lối xe nâng`,
    discipline: 'Kiến trúc', reason: REASONS[1],
  }),
  (b) => ({
    text: `Bổ sung tủ điện phân phối dự phòng khu văn phòng Block ${b} theo yêu cầu chủ đầu tư`,
    discipline: 'MEP', reason: REASONS[0],
  }),
  (_b) => ({
    text: `Điều chỉnh khoảng cách lưới cột trục ${axis()} thêm ${randInt(rng, 100, 400)}mm để tối ưu bố trí kệ hàng cho khách thuê`,
    discipline: 'Kết cấu', reason: REASONS[0],
  }),
  (b) => ({
    text: `Bổ sung hố ga tách rác trước khi vào hệ thống xử lý nước mưa khu vực Block ${b}`,
    discipline: 'Hạ tầng', reason: REASONS[4],
  }),
  (b) => ({
    text: `Thay đổi vị trí miệng gió hồi khu văn phòng Block ${b} để tránh trùng đèn âm trần`,
    discipline: 'MEP', reason: REASONS[2],
  }),
  (b) => ({
    text: `Bổ sung mái che khu vực bãi tập kết vật tư ngoài trời gần Block ${b}`,
    discipline: 'Kiến trúc', reason: REASONS[4],
  }),
]

const IMPACT_POOL = [
  'Không thay đổi khối lượng',
  '+8 triệu đồng vật tư',
  '+35 triệu đồng vật tư',
  '+120 triệu đồng vật tư',
  '-2% khối lượng đào đắp khu vực liên quan',
  '+15 md tuyến ống',
  '+80 md tuyến ống',
  '+2 cửa thoát hiểm',
  '+1 tủ điện phân phối',
  'Tăng khoảng 5% khối lượng thép mái khu vực liên quan',
  'Không phát sinh chi phí',
  '+45 triệu đồng nhân công điều chỉnh',
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
