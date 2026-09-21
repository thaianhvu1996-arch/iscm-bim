import type { Lang } from '../i18n/LanguageContext'

export type BlockId = 'A' | 'B' | 'C' | 'D'

export type Discipline = 'Kiến trúc' | 'Kết cấu' | 'MEP' | 'Hạ tầng'

export type UserRole = 'contractor' | 'investor' | 'bim_manager'

export type ScreenId = 'dashboard' | 'model3d' | 'schedule' | 'quantity' | 'clash' | 'asbuilt' | 'assets'

export type AppView = 'intro' | ScreenId

export interface RolePermissions {
  visibleScreens: ScreenId[]
  canSeeClashDetail: boolean
  canEditClashStatus: boolean
}

export interface BlockInfo {
  id: BlockId
  name: string
  areaM2: number
}

// ----- Tiến độ thi công -----

export type ScheduleStatus =
  | 'Chưa bắt đầu'
  | 'Đúng tiến độ'
  | 'Chậm tiến độ'
  | 'Sớm tiến độ'
  | 'Hoàn thành'

export interface ScheduleItem {
  id: string
  name: Record<Lang, string>
  discipline: Discipline
  block: BlockId | 'Toàn dự án'
  unit: string
  plannedQty: number
  actualQty: number
  plannedStart: Date
  plannedEnd: Date
  actualStart: Date | null
  actualEnd: Date | null
  percentComplete: number
  status: ScheduleStatus
  delayDays: number
  note: Record<Lang, string>
  isCriticalPath: boolean
}

// ----- Xung đột (Clash) -----

export type ClashSeverity = 'A' | 'B' | 'C'

export type ClashStatus = 'Mới' | 'Đang xử lý' | 'Đã xử lý' | 'Bỏ qua'

export interface ClashComment {
  author: string
  date: Date
  message: Record<Lang, string>
}

export interface Clash {
  id: string
  description: Record<Lang, string>
  disciplineA: Discipline
  disciplineB: Discipline
  block: BlockId
  elevation: string
  severity: ClashSeverity
  estimatedCost: number
  status: ClashStatus
  assignee: string
  detectedDate: Date
  dueDate: Date
  resolvedDate: Date | null
  comments: ClashComment[]
  position: { x: number; y: number; z: number }
}

// ----- Thiết bị / Tài sản -----

export type EquipmentSystem = 'PCCC' | 'Điện' | 'Cấp thoát nước' | 'HVAC' | 'Hạ tầng'

export interface MaintenanceTask {
  date: Date
  task: Record<Lang, string>
}

export interface Equipment {
  id: string
  name: Record<Lang, string>
  system: EquipmentSystem
  block: BlockId | 'Toàn dự án'
  location: Record<Lang, string>
  manufacturer: string
  model: string
  capacity: Record<Lang, string>
  installDate: Date
  warrantyUntil: Date
  maintenanceCycleMonths: number
  documents: Record<Lang, string[]>
  upcomingMaintenance: MaintenanceTask[]
}

// ----- Hoàn công & Thay đổi hiện trường -----

export type FieldChangeStatus = 'Chờ cập nhật' | 'Đã cập nhật'

export interface FieldChange {
  id: string
  date: Date
  block: BlockId
  discipline: Discipline
  description: Record<Lang, string>
  reason: Record<Lang, string>
  reporter: string
  modelStatus: FieldChangeStatus
  quantityImpact: Record<Lang, string>
}

export interface ModelVersion {
  version: string
  date: Date
  changesIntegrated: number
  author: string
  note: Record<Lang, string>
}

// ----- Cảnh báo (Dashboard) -----

export type AlertLevel = 'Nghiêm trọng' | 'Cảnh báo' | 'Thông tin'

export interface AlertItem {
  id: string
  level: AlertLevel
  title: Record<Lang, string>
  time: Date
  assignee: string
}

// ----- Thông tin cho thuê -----

export interface TenantInfo {
  block: BlockId
  leasableAreaM2: number
  floorLoadTonPerM2: number
  clearHeightM: number
  powerSupplyKVA: number
  powerUsedKVA: number
  containerDoors: number
  status: 'Còn trống' | 'Đã thuê'
  tenantName?: Record<Lang, string>
}
