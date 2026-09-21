import type { RolePermissions, ScreenId, UserRole } from '../types'
import type { Lang } from '../i18n/LanguageContext'

export const ALL_SCREENS: ScreenId[] = [
  'dashboard',
  'model3d',
  'schedule',
  'quantity',
  'clash',
  'asbuilt',
  'assets',
]

const ROLE_LABELS_BY_LANG: Record<Lang, Record<UserRole, string>> = {
  vi: {
    contractor: 'Ban Giám đốc nhà thầu',
    investor: 'Chủ đầu tư',
    bim_manager: 'Quản lý BIM',
  },
  en: {
    contractor: 'Contractor Board',
    investor: 'Investor',
    bim_manager: 'BIM Manager',
  },
}
export function roleLabel(role: UserRole, lang: Lang): string {
  return ROLE_LABELS_BY_LANG[lang][role]
}

export const ROLE_ORDER: UserRole[] = ['contractor', 'investor', 'bim_manager']

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  contractor: {
    visibleScreens: ALL_SCREENS,
    canSeeClashDetail: true,
    canEditClashStatus: false,
  },
  investor: {
    visibleScreens: ['dashboard', 'model3d', 'schedule', 'assets'],
    canSeeClashDetail: false,
    canEditClashStatus: false,
  },
  bim_manager: {
    visibleScreens: ALL_SCREENS,
    canSeeClashDetail: true,
    canEditClashStatus: true,
  },
}

const SCREEN_LABELS_BY_LANG: Record<Lang, Record<ScreenId, string>> = {
  vi: {
    dashboard: 'Tổng quan',
    model3d: 'Mô hình 3D',
    schedule: 'Tiến độ thi công',
    quantity: 'Khối lượng & Chi phí',
    clash: 'Kiểm tra xung đột',
    asbuilt: 'Hoàn công & Thay đổi',
    assets: 'Tài sản & Vận hành',
  },
  en: {
    dashboard: 'Overview',
    model3d: '3D Model',
    schedule: 'Schedule',
    quantity: 'Quantity & Cost',
    clash: 'Clash Detection',
    asbuilt: 'As-Built & Changes',
    assets: 'Assets & Operations',
  },
}
export function screenLabel(screen: ScreenId, lang: Lang): string {
  return SCREEN_LABELS_BY_LANG[lang][screen]
}
