import type { BlockInfo, Discipline } from '../types'
import type { Lang } from '../i18n/LanguageContext'

// Không gắn tên dự án/chủ đầu tư/nhà thầu/địa danh cụ thể nào - đây là công trình minh hoạ
// dùng để trình diễn năng lực BIM của ISCM-UEH, không phải hồ sơ của một dự án thật.
export const PROJECT_NAME: Record<Lang, string> = {
  vi: 'Nhà xưởng công nghiệp cho thuê',
  en: 'Industrial warehouse for lease',
}
export const PLATFORM_TITLE: Record<Lang, string> = {
  vi: 'CÔNG TRÌNH MINH HOẠ — Nhà xưởng công nghiệp cho thuê',
  en: 'ILLUSTRATIVE PROJECT — Industrial Warehouse for Lease',
}
export const PROJECT_VALUE = 312_000_000_000
export const TOTAL_AREA_M2 = 39_000

// Mốc thời gian dự án: khởi công 01/09/2026, hoàn thành 31/05/2027
export const PROJECT_START = new Date(2026, 8, 1)
export const PROJECT_END = new Date(2027, 4, 31)
// Thời điểm "hiện tại" trong demo: đầu tháng thi công thứ 4 (đầu tháng 12/2026)
export const CURRENT_DATE = new Date(2026, 11, 3)

export const TOTAL_PROJECT_DAYS = Math.round(
  (PROJECT_END.getTime() - PROJECT_START.getTime()) / 86400000,
)
export const ELAPSED_DAYS = Math.round(
  (CURRENT_DATE.getTime() - PROJECT_START.getTime()) / 86400000,
)
export const REMAINING_DAYS = TOTAL_PROJECT_DAYS - ELAPSED_DAYS
export const CURRENT_MONTH_INDEX = Math.min(
  9,
  Math.max(
    1,
    (CURRENT_DATE.getFullYear() - PROJECT_START.getFullYear()) * 12 +
      (CURRENT_DATE.getMonth() - PROJECT_START.getMonth()) +
      1,
  ),
)

export const BLOCKS: BlockInfo[] = [
  { id: 'A', name: 'Block A', areaM2: 9750 },
  { id: 'B', name: 'Block B', areaM2: 9750 },
  { id: 'C', name: 'Block C', areaM2: 9750 },
  { id: 'D', name: 'Block D', areaM2: 9750 },
]
export const BLOCK_IDS = BLOCKS.map((b) => b.id)

export const DISCIPLINES: Discipline[] = ['Kiến trúc', 'Kết cấu', 'MEP', 'Hạ tầng']

export const DISCIPLINE_COLORS: Record<Discipline, string> = {
  'Kiến trúc': '#94a3b8',
  'Kết cấu': '#5b8def',
  MEP: '#00f2fe',
  'Hạ tầng': '#14b8a6',
}

// Bảng màu định danh (categorical) cho biểu đồ nhiều nhóm - đã kiểm tra độ tương phản
// và phân biệt màu cho người mù màu (CVD) trên nền navy tối của app.
export const CHART_PALETTE = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#9085e9']

// Màu thương hiệu ISCM - dùng cho nút chính, tiêu đề nhấn, chỉ báo active
export const BRAND_COLOR = '#c72127'
export const BRAND_GLOW = 'rgba(199, 33, 39, 0.45)'
// Màu dữ liệu kỹ thuật - dùng tiết chế, không dùng cho brand/nút bấm
export const TECHNICAL_COLOR = '#00f2fe'

export const STATUS_COLORS = {
  success: '#00e676',
  successDim: '#00b85e',
  warning: '#ffab00',
  danger: '#ff5252',
  info: '#3b82f6',
  neutral: '#64748b',
}

// Tiến độ vật lý ước tính theo block tại thời điểm hiện tại (block A thi công trước, D sau cùng)
export const BLOCK_PROGRESS: Record<string, number> = {
  A: 42,
  B: 35,
  C: 26,
  D: 17,
}

export const OVERALL_PLANNED_PROGRESS = 35
export const OVERALL_ACTUAL_PROGRESS = 30
