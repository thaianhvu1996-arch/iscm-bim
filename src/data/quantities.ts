import type { BlockId, Discipline } from '../types'
import type { Lang } from '../i18n/LanguageContext'
import { createRng, pickWeighted, randFloat, chance } from '../utils/random'
import { PROJECT_START } from './constants'
import { addMonths } from '../utils/random'

export type QuantityGroup =
  | 'Kết cấu - Bê tông'
  | 'Kết cấu - Thép'
  | 'Kiến trúc'
  | 'MEP - Điện'
  | 'MEP - Cơ & Đường ống'
  | 'Hạ tầng'

export type QuantityStatus = 'Khớp' | 'Cần rà soát' | 'Chênh lệch lớn'

export interface QuantityItem {
  id: string
  group: QuantityGroup
  discipline: Discipline
  block: BlockId | 'Toàn dự án'
  name: Record<Lang, string>
  unit: string
  contractQty: number
  modelQty: number
  diffPercent: number
  unitPrice: number
  costImpact: number
  status: QuantityStatus
}

export interface ProcurementBatch {
  id: string
  materialGroup: Record<Lang, string>
  quantitySummary: Record<Lang, string>
  releaseDate: Date
  status: 'Đã phát hành' | 'Đang chuẩn bị'
}

const rng = createRng(661044)

interface ItemTemplate {
  id: string
  group: QuantityGroup
  discipline: Discipline
  name: Record<Lang, string>
  unit: string
  qtyRange: [number, number]
  price: number
}

const TEMPLATES: ItemTemplate[] = [
  // ----- Kết cấu - Bê tông -----
  { id: 'KC-01', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Bê tông lót móng đá 4x6 M100', en: 'M100 lean concrete, footing base, 4x6 gravel' }, unit: 'm³', qtyRange: [180, 260], price: 1_100_000 },
  { id: 'KC-02', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Bê tông đài móng M300', en: 'M300 concrete, footings' }, unit: 'm³', qtyRange: [620, 780], price: 1_750_000 },
  { id: 'KC-03', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Bê tông giằng móng M300', en: 'M300 concrete, ground beams' }, unit: 'm³', qtyRange: [210, 290], price: 1_780_000 },
  { id: 'KC-04', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Bê tông cột tầng trệt M300', en: 'M300 concrete, ground-floor columns' }, unit: 'm³', qtyRange: [95, 140], price: 1_820_000 },
  { id: 'KC-05', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Bê tông cột C30 tầng trệt khu văn phòng', en: 'C30 concrete, ground-floor office columns' }, unit: 'm³', qtyRange: [45, 70], price: 1_900_000 },
  { id: 'KC-06', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Bê tông sàn tầng 2 khu văn phòng M300', en: 'M300 concrete, level-2 office floor slab' }, unit: 'm³', qtyRange: [280, 340], price: 1_780_000 },
  { id: 'KC-07', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Bê tông dầm sàn tầng 2 M300', en: 'M300 concrete, level-2 floor beams' }, unit: 'm³', qtyRange: [120, 165], price: 1_850_000 },
  { id: 'KC-08', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Cốt thép móng', en: 'Foundation reinforcement steel' }, unit: 'kg', qtyRange: [68_000, 85_000], price: 20_500 },
  { id: 'KC-09', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Cốt thép cột', en: 'Column reinforcement steel' }, unit: 'kg', qtyRange: [32_000, 42_000], price: 21_000 },
  { id: 'KC-10', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Cốt thép sàn tầng 2', en: 'Level-2 floor reinforcement steel' }, unit: 'kg', qtyRange: [38_000, 48_000], price: 20_800 },
  { id: 'KC-11', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Cốt thép dầm', en: 'Beam reinforcement steel' }, unit: 'kg', qtyRange: [26_000, 34_000], price: 21_200 },
  { id: 'KC-12', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Ván khuôn móng', en: 'Foundation formwork' }, unit: 'm²', qtyRange: [2_400, 3_100], price: 185_000 },
  { id: 'KC-13', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Ván khuôn cột', en: 'Column formwork' }, unit: 'm²', qtyRange: [1_800, 2_300], price: 210_000 },
  { id: 'KC-14', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Ván khuôn sàn tầng 2', en: 'Level-2 floor formwork' }, unit: 'm²', qtyRange: [3_200, 3_900], price: 195_000 },
  { id: 'KC-15', group: 'Kết cấu - Bê tông', discipline: 'Kết cấu', name: { vi: 'Bê tông nền nhà xưởng M250', en: 'M250 concrete, warehouse floor slab' }, unit: 'm³', qtyRange: [780, 950], price: 1_420_000 },
  // ----- Kết cấu - Thép -----
  { id: 'KC-16', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Cột thép hình H tổ hợp', en: 'Built-up H-section steel columns' }, unit: 'kg', qtyRange: [210_000, 260_000], price: 29_500 },
  { id: 'KC-17', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Vì kèo thép mái', en: 'Steel roof trusses' }, unit: 'kg', qtyRange: [95_000, 125_000], price: 30_500 },
  { id: 'KC-18', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Xà gồ mái thép Z200', en: 'Z200 steel roof purlins' }, unit: 'kg', qtyRange: [58_000, 72_000], price: 28_000 },
  { id: 'KC-19', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Giằng mái thép', en: 'Steel roof bracing' }, unit: 'kg', qtyRange: [18_000, 24_000], price: 27_500 },
  { id: 'KC-20', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Giằng cột thép', en: 'Steel column bracing' }, unit: 'kg', qtyRange: [12_000, 16_000], price: 27_500 },
  { id: 'KC-21', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Bulông neo móng', en: 'Foundation anchor bolts' }, unit: 'bộ', qtyRange: [280, 360], price: 150_000 },
  { id: 'KC-22', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Sơn chống gỉ kết cấu thép', en: 'Anti-rust primer, steel structure' }, unit: 'm²', qtyRange: [8_500, 10_500], price: 48_000 },
  { id: 'KC-23', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Sơn hoàn thiện kết cấu thép', en: 'Finish coat, steel structure' }, unit: 'm²', qtyRange: [8_500, 10_500], price: 42_000 },
  { id: 'KC-24', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Bản mã liên kết thép', en: 'Steel connection gusset plates' }, unit: 'kg', qtyRange: [15_000, 20_000], price: 31_000 },
  { id: 'KC-25', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Cầu thang thép thoát hiểm', en: 'Steel emergency-exit stairs' }, unit: 'bộ', qtyRange: [6, 10], price: 15_500_000 },
  { id: 'KC-26', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Sàn thao tác thép (mezzanine)', en: 'Steel mezzanine platform' }, unit: 'm²', qtyRange: [320, 420], price: 850_000 },
  { id: 'KC-27', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Lan can thép mái, sàn thao tác', en: 'Steel handrails, roof & platform' }, unit: 'md', qtyRange: [180, 250], price: 650_000 },
  { id: 'KC-28', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Tôn sàn liên hợp (deck)', en: 'Composite floor deck' }, unit: 'm²', qtyRange: [280, 340], price: 320_000 },
  { id: 'KC-29', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Kết cấu đỡ mái tôn sáng', en: 'Support structure, skylight panels' }, unit: 'kg', qtyRange: [4_500, 6_500], price: 29_000 },
  { id: 'KC-30', group: 'Kết cấu - Thép', discipline: 'Kết cấu', name: { vi: 'Bích liên kết cột - móng', en: 'Column-to-foundation base plates' }, unit: 'kg', qtyRange: [6_000, 8_500], price: 30_000 },
  // ----- Kiến trúc -----
  { id: 'KT-01', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Tôn mái 1 lớp dày 0,45mm', en: '0.45mm single-layer roof sheeting' }, unit: 'm²', qtyRange: [9_200, 10_500], price: 195_000 },
  { id: 'KT-02', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Tôn sáng lấy sáng mái', en: 'Roof skylight panels' }, unit: 'm²', qtyRange: [280, 380], price: 285_000 },
  { id: 'KT-03', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Tường bao panel cách nhiệt EPS', en: 'EPS insulated panel perimeter wall' }, unit: 'm²', qtyRange: [3_800, 4_600], price: 465_000 },
  { id: 'KT-04', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Tường gạch xây ngăn cháy', en: 'Brick fire-separation wall' }, unit: 'm²', qtyRange: [1_200, 1_600], price: 320_000 },
  { id: 'KT-05', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Trát tường', en: 'Wall plastering' }, unit: 'm²', qtyRange: [2_400, 3_000], price: 85_000 },
  { id: 'KT-06', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Sơn nước ngoài nhà', en: 'Exterior paint' }, unit: 'm²', qtyRange: [2_200, 2_800], price: 52_000 },
  { id: 'KT-07', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Sơn nước trong nhà khu văn phòng', en: 'Interior paint, office area' }, unit: 'm²', qtyRange: [1_800, 2_300], price: 46_000 },
  { id: 'KT-08', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Sơn nền epoxy nhà xưởng', en: 'Warehouse floor epoxy coating' }, unit: 'm²', qtyRange: [8_400, 9_600], price: 185_000 },
  { id: 'KT-09', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Cửa cuốn container', en: 'Container roller shutters' }, unit: 'bộ', qtyRange: [8, 12], price: 18_500_000 },
  { id: 'KT-10', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Cửa đi, cửa sổ nhôm kính khu văn phòng', en: 'Aluminum-glass doors & windows, office area' }, unit: 'bộ', qtyRange: [30, 45], price: 2_600_000 },
  { id: 'KT-11', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Vách kính mặt tiền văn phòng', en: 'Office façade glass curtain wall' }, unit: 'm²', qtyRange: [180, 240], price: 1_850_000 },
  { id: 'KT-12', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Trần thạch cao khu văn phòng', en: 'Gypsum ceiling, office area' }, unit: 'm²', qtyRange: [950, 1_150], price: 225_000 },
  { id: 'KT-13', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Lát gạch nền khu văn phòng', en: 'Floor tiling, office area' }, unit: 'm²', qtyRange: [950, 1_150], price: 285_000 },
  { id: 'KT-14', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Ốp gạch khu vệ sinh', en: 'Wall tiling, restrooms' }, unit: 'm²', qtyRange: [280, 360], price: 255_000 },
  { id: 'KT-15', group: 'Kiến trúc', discipline: 'Kiến trúc', name: { vi: 'Lan can kính cầu thang văn phòng', en: 'Glass stair handrails, office' }, unit: 'md', qtyRange: [60, 90], price: 1_250_000 },
  // ----- MEP - Điện -----
  { id: 'MEP-01', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Cáp điện trung thế ngầm', en: 'Underground medium-voltage cable' }, unit: 'm', qtyRange: [850, 1_050], price: 460_000 },
  { id: 'MEP-02', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Trạm biến áp', en: 'Transformer station' }, unit: 'bộ', qtyRange: [1, 1], price: 850_000_000 },
  { id: 'MEP-03', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Tủ điện tổng MSB', en: 'Main switchboard (MSB)' }, unit: 'bộ', qtyRange: [1, 2], price: 180_000_000 },
  { id: 'MEP-04', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Tủ điện phân phối DB', en: 'Distribution panel (DB)' }, unit: 'bộ', qtyRange: [4, 6], price: 25_000_000 },
  { id: 'MEP-05', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Máng cáp điện', en: 'Cable tray' }, unit: 'md', qtyRange: [1_400, 1_700], price: 385_000 },
  { id: 'MEP-06', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Dây cáp điện động lực', en: 'Power cable' }, unit: 'm', qtyRange: [8_500, 10_500], price: 88_000 },
  { id: 'MEP-07', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Đèn LED highbay nhà xưởng', en: 'Warehouse LED highbay lights' }, unit: 'bộ', qtyRange: [280, 340], price: 2_250_000 },
  { id: 'MEP-08', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Đèn chiếu sáng sự cố', en: 'Emergency lighting' }, unit: 'bộ', qtyRange: [85, 110], price: 650_000 },
  { id: 'MEP-09', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Ổ cắm công nghiệp', en: 'Industrial power outlets' }, unit: 'bộ', qtyRange: [45, 65], price: 450_000 },
  { id: 'MEP-10', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Hệ thống chống sét & tiếp địa', en: 'Lightning protection & grounding system' }, unit: 'hệ thống', qtyRange: [1, 1], price: 180_000_000 },
  { id: 'MEP-11', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Tủ tụ bù', en: 'Capacitor bank panel' }, unit: 'bộ', qtyRange: [1, 2], price: 65_000_000 },
  { id: 'MEP-12', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Máy phát điện dự phòng', en: 'Standby generator' }, unit: 'bộ', qtyRange: [1, 1], price: 1_200_000_000 },
  { id: 'MEP-13', group: 'MEP - Điện', discipline: 'MEP', name: { vi: 'Camera an ninh', en: 'Security cameras' }, unit: 'bộ', qtyRange: [24, 32], price: 3_500_000 },
  // ----- MEP - Cơ & Đường ống -----
  { id: 'MEP-14', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Ống gió tôn tráng kẽm D600', en: 'D600 galvanized steel ductwork' }, unit: 'kg', qtyRange: [4_800, 5_800], price: 145_000 },
  { id: 'MEP-15', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Ống gió tôn tráng kẽm D400', en: 'D400 galvanized steel ductwork' }, unit: 'kg', qtyRange: [3_200, 3_900], price: 135_000 },
  { id: 'MEP-16', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Ống gió tôn tráng kẽm D300', en: 'D300 galvanized steel ductwork' }, unit: 'kg', qtyRange: [2_100, 2_600], price: 130_000 },
  { id: 'MEP-17', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Miệng gió cấp/hồi', en: 'Supply/return air grilles' }, unit: 'bộ', qtyRange: [95, 120], price: 850_000 },
  { id: 'MEP-18', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Quạt hút công nghiệp mái', en: 'Roof industrial exhaust fans' }, unit: 'bộ', qtyRange: [12, 16], price: 12_500_000 },
  { id: 'MEP-19', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Quạt cấp gió tươi', en: 'Fresh-air supply fans' }, unit: 'bộ', qtyRange: [3, 5], price: 15_000_000 },
  { id: 'MEP-20', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Điều hòa VRV khu văn phòng', en: 'VRV air conditioning, office area' }, unit: 'bộ', qtyRange: [1, 2], price: 185_000_000 },
  { id: 'MEP-21', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Ống nước PCCC (sprinkler) DN100', en: 'DN100 fire-protection pipe (sprinkler)' }, unit: 'md', qtyRange: [1_100, 1_350], price: 380_000 },
  { id: 'MEP-22', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Ống nước PCCC DN150', en: 'DN150 fire-protection pipe' }, unit: 'md', qtyRange: [420, 540], price: 520_000 },
  { id: 'MEP-23', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Đầu phun sprinkler', en: 'Sprinkler heads' }, unit: 'bộ', qtyRange: [620, 780], price: 450_000 },
  { id: 'MEP-24', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Máy bơm chữa cháy', en: 'Fire pump' }, unit: 'bộ', qtyRange: [1, 1], price: 350_000_000 },
  { id: 'MEP-25', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Bể nước dự trữ chữa cháy', en: 'Fire-reserve water tank' }, unit: 'm³', qtyRange: [280, 340], price: 2_800_000 },
  { id: 'MEP-26', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Ống cấp nước sinh hoạt', en: 'Domestic water supply pipe' }, unit: 'md', qtyRange: [380, 480], price: 220_000 },
  { id: 'MEP-27', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Ống thoát nước thải', en: 'Wastewater drainage pipe' }, unit: 'md', qtyRange: [420, 520], price: 250_000 },
  { id: 'MEP-28', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Bể tự hoại', en: 'Septic tank' }, unit: 'bộ', qtyRange: [1, 1], price: 45_000_000 },
  { id: 'MEP-29', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Bơm nước thải', en: 'Wastewater pump' }, unit: 'bộ', qtyRange: [2, 2], price: 28_000_000 },
  { id: 'MEP-30', group: 'MEP - Cơ & Đường ống', discipline: 'MEP', name: { vi: 'Tủ báo cháy trung tâm (FACP)', en: 'Fire alarm control panel (FACP)' }, unit: 'bộ', qtyRange: [1, 1], price: 120_000_000 },
  // ----- Hạ tầng -----
  { id: 'HT-01', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'San nền, đào đắp đất', en: 'Grading & earthworks' }, unit: 'm³', qtyRange: [175_000, 195_000], price: 85_000 },
  { id: 'HT-02', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Đường nội bộ bê tông nhựa', en: 'Internal asphalt road' }, unit: 'm²', qtyRange: [11_500, 13_500], price: 650_000 },
  { id: 'HT-03', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Vỉa hè lát gạch block', en: 'Concrete-block paved sidewalk' }, unit: 'm²', qtyRange: [2_800, 3_400], price: 280_000 },
  { id: 'HT-04', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Bó vỉa bê tông', en: 'Concrete curb' }, unit: 'md', qtyRange: [1_800, 2_200], price: 180_000 },
  { id: 'HT-05', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Ống thoát nước mưa ngoài nhà D400', en: 'D400 outdoor stormwater pipe' }, unit: 'md', qtyRange: [1_600, 1_900], price: 450_000 },
  { id: 'HT-06', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Ống thoát nước mưa ngoài nhà D600', en: 'D600 outdoor stormwater pipe' }, unit: 'md', qtyRange: [850, 1_050], price: 680_000 },
  { id: 'HT-07', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Hố ga thoát nước', en: 'Drainage manholes' }, unit: 'cái', qtyRange: [38, 46], price: 3_500_000 },
  { id: 'HT-08', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Ống cấp nước ngoài nhà D110', en: 'D110 outdoor water supply pipe' }, unit: 'md', qtyRange: [1_100, 1_350], price: 280_000 },
  { id: 'HT-09', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Trụ chữa cháy ngoài nhà', en: 'Outdoor fire hydrants' }, unit: 'bộ', qtyRange: [6, 8], price: 15_000_000 },
  { id: 'HT-10', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Hàng rào lưới thép B40', en: 'B40 steel-mesh fencing' }, unit: 'md', qtyRange: [650, 720], price: 850_000 },
  { id: 'HT-11', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Cổng chính và cổng phụ', en: 'Main & secondary gates' }, unit: 'bộ', qtyRange: [2, 2], price: 180_000_000 },
  { id: 'HT-12', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Nhà bảo vệ', en: 'Guardhouse' }, unit: 'm²', qtyRange: [24, 32], price: 4_500_000 },
  { id: 'HT-13', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Đèn chiếu sáng sân bãi', en: 'Yard lighting' }, unit: 'bộ', qtyRange: [22, 28], price: 8_500_000 },
  { id: 'HT-14', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Cây xanh, cảnh quan', en: 'Trees & landscaping' }, unit: 'cây', qtyRange: [180, 240], price: 1_200_000 },
  { id: 'HT-15', group: 'Hạ tầng', discipline: 'Hạ tầng', name: { vi: 'Trạm cân xe tải', en: 'Truck weighbridge' }, unit: 'bộ', qtyRange: [1, 1], price: 450_000_000 },
]

const BLOCK_WEIGHTS: Array<[BlockId, number]> = [
  ['A', 30],
  ['B', 27],
  ['C', 23],
  ['D', 20],
]

function statusFromDiff(diffPercent: number): QuantityStatus {
  const abs = Math.abs(diffPercent)
  if (abs > 10) return 'Chênh lệch lớn'
  if (abs >= 3) return 'Cần rà soát'
  return 'Khớp'
}

function generateQuantities(): QuantityItem[] {
  return TEMPLATES.map((t) => {
    const block: BlockId | 'Toàn dự án' = t.group === 'Hạ tầng' ? 'Toàn dự án' : pickWeighted(rng, BLOCK_WEIGHTS)
    const contractQty = Math.round(randFloat(rng, t.qtyRange[0], t.qtyRange[1], 0))
    const flagged = chance(rng, 0.17)
    const variance = flagged
      ? randFloat(rng, 0.05, 0.28, 3) * (chance(rng, 0.5) ? 1 : -1)
      : randFloat(rng, 0.002, 0.02, 3) * (chance(rng, 0.5) ? 1 : -1)
    const modelQty = Math.max(0, Math.round(contractQty * (1 + variance)))
    const diffPercent = Math.round(((modelQty - contractQty) / contractQty) * 1000) / 10
    const costImpact = Math.round((modelQty - contractQty) * t.price)

    return {
      id: t.id,
      group: t.group,
      discipline: t.discipline,
      block,
      name: t.name,
      unit: t.unit,
      contractQty,
      modelQty,
      diffPercent,
      unitPrice: t.price,
      costImpact,
      status: statusFromDiff(diffPercent),
    }
  })
}

export const quantityItems: QuantityItem[] = generateQuantities()

const BATCH_TEMPLATES: Array<{
  id: string
  materialGroup: Record<Lang, string>
  quantitySummary: Record<Lang, string>
  month: number
}> = [
  {
    id: 'DOT-01',
    materialGroup: { vi: 'Thép kết cấu & bê tông', en: 'Structural steel & concrete' },
    quantitySummary: { vi: '~950 tấn thép hình, 5.200 m³ bê tông thương phẩm', en: '~950 tons structural steel, 5,200 m³ ready-mix concrete' },
    month: 2,
  },
  {
    id: 'DOT-02',
    materialGroup: { vi: 'Vật tư MEP - điện & PCCC', en: 'MEP materials - electrical & fire protection' },
    quantitySummary: { vi: 'Trạm biến áp, tủ điện tổng, hệ thống bơm & ống PCCC', en: 'Transformer station, main switchboard, fire pump & piping systems' },
    month: 4,
  },
  {
    id: 'DOT-03',
    materialGroup: { vi: 'Hoàn thiện kiến trúc & nội thất văn phòng', en: 'Architectural finishing & office interiors' },
    quantitySummary: { vi: 'Vách kính, trần thạch cao, gạch lát, sơn hoàn thiện', en: 'Glass partitions, gypsum ceiling, floor tiling, finish paint' },
    month: 7,
  },
]

export const procurementBatches: ProcurementBatch[] = BATCH_TEMPLATES.map((b) => ({
  id: b.id,
  materialGroup: b.materialGroup,
  quantitySummary: b.quantitySummary,
  releaseDate: addMonths(PROJECT_START, b.month - 1),
  status: b.month <= 4 ? 'Đã phát hành' : 'Đang chuẩn bị',
}))

export const QUANTITY_GROUPS: QuantityGroup[] = [
  'Kết cấu - Bê tông',
  'Kết cấu - Thép',
  'Kiến trúc',
  'MEP - Điện',
  'MEP - Cơ & Đường ống',
  'Hạ tầng',
]
