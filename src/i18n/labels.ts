import type {
  AlertLevel,
  ClashSeverity,
  ClashStatus,
  Discipline,
  EquipmentSystem,
  FieldChangeStatus,
  ScheduleStatus,
} from '../types'
import type { QuantityGroup, QuantityStatus } from '../data/quantities'
import type { Lang } from './LanguageContext'

// Vietnamese string literals stay the canonical internal keys throughout the
// app (tone.ts, filters, object indexing all compare against them) — these
// functions are a display-only translation layer, never used for logic.

const DISCIPLINE_EN: Record<Discipline, string> = {
  'Kiến trúc': 'Architecture',
  'Kết cấu': 'Structure',
  MEP: 'MEP',
  'Hạ tầng': 'Infrastructure',
}
export function disciplineLabel(d: Discipline, lang: Lang): string {
  return lang === 'vi' ? d : DISCIPLINE_EN[d]
}

const SCHEDULE_STATUS_EN: Record<ScheduleStatus, string> = {
  'Chưa bắt đầu': 'Not started',
  'Đúng tiến độ': 'On schedule',
  'Chậm tiến độ': 'Delayed',
  'Sớm tiến độ': 'Ahead of schedule',
  'Hoàn thành': 'Completed',
}
export function scheduleStatusLabel(s: ScheduleStatus, lang: Lang): string {
  return lang === 'vi' ? s : SCHEDULE_STATUS_EN[s]
}

const CLASH_STATUS_EN: Record<ClashStatus, string> = {
  Mới: 'New',
  'Đang xử lý': 'In progress',
  'Đã xử lý': 'Resolved',
  'Bỏ qua': 'Ignored',
}
export function clashStatusLabel(s: ClashStatus, lang: Lang): string {
  return lang === 'vi' ? s : CLASH_STATUS_EN[s]
}

const CLASH_SEVERITY_EN: Record<ClashSeverity, string> = {
  A: 'Group A — major impact',
  B: 'Group B — moderate',
  C: 'Group C — minor',
}
const CLASH_SEVERITY_VI: Record<ClashSeverity, string> = {
  A: 'Nhóm A - ảnh hưởng lớn',
  B: 'Nhóm B - trung bình',
  C: 'Nhóm C - nhỏ',
}
export function clashSeverityLabel(s: ClashSeverity, lang: Lang): string {
  return lang === 'vi' ? CLASH_SEVERITY_VI[s] : CLASH_SEVERITY_EN[s]
}

const EQUIPMENT_SYSTEM_EN: Record<EquipmentSystem, string> = {
  PCCC: 'Fire protection',
  Điện: 'Electrical',
  'Cấp thoát nước': 'Water supply & drainage',
  HVAC: 'HVAC',
  'Hạ tầng': 'Infrastructure',
}
export function equipmentSystemLabel(s: EquipmentSystem, lang: Lang): string {
  return lang === 'vi' ? s : EQUIPMENT_SYSTEM_EN[s]
}

const FIELD_CHANGE_STATUS_EN: Record<FieldChangeStatus, string> = {
  'Chờ cập nhật': 'Pending update',
  'Đã cập nhật': 'Updated',
}
export function fieldChangeStatusLabel(s: FieldChangeStatus, lang: Lang): string {
  return lang === 'vi' ? s : FIELD_CHANGE_STATUS_EN[s]
}

const ALERT_LEVEL_EN: Record<AlertLevel, string> = {
  'Nghiêm trọng': 'Critical',
  'Cảnh báo': 'Warning',
  'Thông tin': 'Info',
}
export function alertLevelLabel(l: AlertLevel, lang: Lang): string {
  return lang === 'vi' ? l : ALERT_LEVEL_EN[l]
}

const TENANT_STATUS_EN: Record<'Còn trống' | 'Đã thuê', string> = {
  'Còn trống': 'Available',
  'Đã thuê': 'Leased',
}
export function tenantStatusLabel(s: 'Còn trống' | 'Đã thuê', lang: Lang): string {
  return lang === 'vi' ? s : TENANT_STATUS_EN[s]
}

const QUANTITY_STATUS_EN: Record<QuantityStatus, string> = {
  Khớp: 'Matched',
  'Cần rà soát': 'Needs review',
  'Chênh lệch lớn': 'Large variance',
}
export function quantityStatusLabel(s: QuantityStatus, lang: Lang): string {
  return lang === 'vi' ? s : QUANTITY_STATUS_EN[s]
}

const QUANTITY_GROUP_EN: Record<QuantityGroup, string> = {
  'Kết cấu - Bê tông': 'Structure - Concrete',
  'Kết cấu - Thép': 'Structure - Steel',
  'Kiến trúc': 'Architecture',
  'MEP - Điện': 'MEP - Electrical',
  'MEP - Cơ & Đường ống': 'MEP - Mechanical & Piping',
  'Hạ tầng': 'Infrastructure',
}
export function quantityGroupLabel(g: QuantityGroup, lang: Lang): string {
  return lang === 'vi' ? g : QUANTITY_GROUP_EN[g]
}

const PROCUREMENT_STATUS_EN: Record<'Đã phát hành' | 'Đang chuẩn bị', string> = {
  'Đã phát hành': 'Released',
  'Đang chuẩn bị': 'In preparation',
}
export function procurementStatusLabel(s: 'Đã phát hành' | 'Đang chuẩn bị', lang: Lang): string {
  return lang === 'vi' ? s : PROCUREMENT_STATUS_EN[s]
}

export function blockLabel(b: string, lang: Lang): string {
  if (b === 'Toàn dự án') return lang === 'vi' ? b : 'Entire project'
  if (b === 'all') return lang === 'vi' ? 'Tất cả' : 'All'
  return b
}

const UNIT_EN: Record<string, string> = {
  'm³': 'm³',
  'm²': 'm²',
  m: 'm',
  kg: 'kg',
  md: 'lm',
  cọc: 'piles',
  tấn: 'tons',
  bộ: 'sets',
  điểm: 'points',
  'đầu phun': 'heads',
  HT: 'system',
  'hệ thống': 'system',
  cái: 'units',
  cây: 'trees',
  tủ: 'panels',
}
export function unitLabel(u: string, lang: Lang): string {
  return lang === 'vi' ? u : (UNIT_EN[u] ?? u)
}
