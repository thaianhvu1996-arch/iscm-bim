import type { BlockId, Discipline, ScheduleItem, ScheduleStatus } from '../types'
import { PROJECT_START, ELAPSED_DAYS } from './constants'
import { createRng, pick, randInt, chance, addDays, clamp } from '../utils/random'

const rng = createRng(3305591)

interface ScheduleTemplate {
  name: string
  discipline: Discipline
  block: BlockId | 'Toàn dự án'
  unit: string
  plannedQty: number
  startDay: number
  endDay: number
  isCriticalPath?: boolean
}

const TEMPLATES: ScheduleTemplate[] = [
  // ----- Hạ tầng -----
  { name: 'San nền & đào đất tổng thể', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'm³', plannedQty: 185000, startDay: 0, endDay: 45, isCriticalPath: true },
  { name: 'Thi công đường nội bộ giai đoạn 1', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'm²', plannedQty: 12500, startDay: 20, endDay: 75 },
  { name: 'Hệ thống thoát nước mưa ngoài nhà', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'md', plannedQty: 3200, startDay: 30, endDay: 95 },
  { name: 'Hệ thống thoát nước thải ngoài nhà', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'md', plannedQty: 2100, startDay: 35, endDay: 95 },
  { name: 'Cấp nước ngoài nhà & PCCC ngoài nhà', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'md', plannedQty: 1800, startDay: 40, endDay: 100 },
  { name: 'Hạ tầng điện trung thế & trạm biến áp', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'md', plannedQty: 950, startDay: 20, endDay: 80, isCriticalPath: true },
  { name: 'Sân bãi, vỉa hè hoàn thiện', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'm²', plannedQty: 8600, startDay: 200, endDay: 260 },
  { name: 'Hàng rào, cổng bảo vệ, nhà bảo vệ', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'md', plannedQty: 680, startDay: 10, endDay: 55 },

  // ----- Kết cấu -----
  { name: 'Ép cọc đại trà Block A', discipline: 'Kết cấu', block: 'A', unit: 'cọc', plannedQty: 420, startDay: 10, endDay: 42, isCriticalPath: true },
  { name: 'Ép cọc đại trà Block B', discipline: 'Kết cấu', block: 'B', unit: 'cọc', plannedQty: 420, startDay: 25, endDay: 57 },
  { name: 'Ép cọc đại trà Block C', discipline: 'Kết cấu', block: 'C', unit: 'cọc', plannedQty: 420, startDay: 45, endDay: 77 },
  { name: 'Ép cọc đại trà Block D', discipline: 'Kết cấu', block: 'D', unit: 'cọc', plannedQty: 420, startDay: 60, endDay: 92 },
  { name: 'Đài móng & đà kiềng Block A', discipline: 'Kết cấu', block: 'A', unit: 'm³', plannedQty: 2850, startDay: 38, endDay: 75, isCriticalPath: true },
  { name: 'Đài móng & đà kiềng Block B', discipline: 'Kết cấu', block: 'B', unit: 'm³', plannedQty: 2850, startDay: 52, endDay: 90 },
  { name: 'Đài móng & đà kiềng Block C', discipline: 'Kết cấu', block: 'C', unit: 'm³', plannedQty: 2850, startDay: 70, endDay: 108 },
  { name: 'Đài móng & đà kiềng Block D', discipline: 'Kết cấu', block: 'D', unit: 'm³', plannedQty: 2850, startDay: 85, endDay: 123 },
  { name: 'Dựng cột thép & vì kèo mái Block A+B', discipline: 'Kết cấu', block: 'Toàn dự án', unit: 'tấn', plannedQty: 1850, startDay: 75, endDay: 150, isCriticalPath: true },
  { name: 'Dựng cột thép & vì kèo mái Block C+D', discipline: 'Kết cấu', block: 'Toàn dự án', unit: 'tấn', plannedQty: 1850, startDay: 105, endDay: 180 },
  { name: 'Kết cấu sàn BTCT khu văn phòng (4 block)', discipline: 'Kết cấu', block: 'Toàn dự án', unit: 'm²', plannedQty: 4200, startDay: 125, endDay: 165 },
  { name: 'Lắp dựng xà gồ, giằng mái toàn dự án', discipline: 'Kết cấu', block: 'Toàn dự án', unit: 'tấn', plannedQty: 620, startDay: 100, endDay: 165 },

  // ----- Kiến trúc -----
  { name: 'Lợp mái tôn & tôn sáng Block A+B', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'm²', plannedQty: 19500, startDay: 135, endDay: 175, isCriticalPath: true },
  { name: 'Lợp mái tôn & tôn sáng Block C+D', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'm²', plannedQty: 19500, startDay: 165, endDay: 205 },
  { name: 'Xây tường bao, tường ngăn cháy Block A+B', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'm²', plannedQty: 8400, startDay: 145, endDay: 190 },
  { name: 'Xây tường bao, tường ngăn cháy Block C+D', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'm²', plannedQty: 8400, startDay: 175, endDay: 220 },
  { name: 'Lắp dựng cửa cuốn container toàn dự án', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'bộ', plannedQty: 36, startDay: 195, endDay: 235 },
  { name: 'Hoàn thiện khu văn phòng (trát, sơn, ốp lát)', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'm²', plannedQty: 4200, startDay: 205, endDay: 255 },
  { name: 'Lắp cửa, vách kính khu văn phòng', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'bộ', plannedQty: 168, startDay: 215, endDay: 255 },
  { name: 'Sơn nền epoxy nhà xưởng', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'm²', plannedQty: 35000, startDay: 225, endDay: 265 },

  // ----- MEP -----
  { name: 'Lắp đặt trạm bơm PCCC & bể nước', discipline: 'MEP', block: 'Toàn dự án', unit: 'HT', plannedQty: 1, startDay: 60, endDay: 110 },
  { name: 'Lắp đặt tủ điện tổng MSB & trạm biến áp', discipline: 'MEP', block: 'Toàn dự án', unit: 'tủ', plannedQty: 8, startDay: 70, endDay: 120 },
  { name: 'Lắp đặt hệ thống điện động lực & chiếu sáng Block A', discipline: 'MEP', block: 'A', unit: 'điểm', plannedQty: 1450, startDay: 150, endDay: 205, isCriticalPath: true },
  { name: 'Lắp đặt hệ thống điện động lực & chiếu sáng Block B', discipline: 'MEP', block: 'B', unit: 'điểm', plannedQty: 1450, startDay: 165, endDay: 220 },
  { name: 'Lắp đặt hệ thống điện động lực & chiếu sáng Block C', discipline: 'MEP', block: 'C', unit: 'điểm', plannedQty: 1450, startDay: 185, endDay: 240 },
  { name: 'Lắp đặt hệ thống điện động lực & chiếu sáng Block D', discipline: 'MEP', block: 'D', unit: 'điểm', plannedQty: 1450, startDay: 200, endDay: 255 },
  { name: 'Lắp đặt hệ thống PCCC (sprinkler, báo cháy) Block A+B', discipline: 'MEP', block: 'Toàn dự án', unit: 'đầu phun', plannedQty: 2600, startDay: 165, endDay: 215 },
  { name: 'Lắp đặt hệ thống PCCC (sprinkler, báo cháy) Block C+D', discipline: 'MEP', block: 'Toàn dự án', unit: 'đầu phun', plannedQty: 2600, startDay: 195, endDay: 245 },
  { name: 'Lắp đặt hệ thống thông gió nhà xưởng toàn dự án', discipline: 'MEP', block: 'Toàn dự án', unit: 'bộ', plannedQty: 96, startDay: 175, endDay: 235 },
  { name: 'Lắp đặt hệ thống cấp thoát nước khu văn phòng', discipline: 'MEP', block: 'Toàn dự án', unit: 'điểm', plannedQty: 320, startDay: 195, endDay: 235 },
  { name: 'Lắp đặt điều hòa không khí khu văn phòng', discipline: 'MEP', block: 'Toàn dự án', unit: 'bộ', plannedQty: 48, startDay: 215, endDay: 255 },
  { name: 'Đấu nối, chạy thử & nghiệm thu hệ thống MEP toàn dự án', discipline: 'MEP', block: 'Toàn dự án', unit: 'HT', plannedQty: 4, startDay: 245, endDay: 273, isCriticalPath: true },

  // ----- Khác -----
  { name: 'Lắp đặt hệ thống camera an ninh & BMS', discipline: 'MEP', block: 'Toàn dự án', unit: 'điểm', plannedQty: 64, startDay: 220, endDay: 255 },
  { name: 'Thi công cảnh quan, cây xanh', discipline: 'Kiến trúc', block: 'Toàn dự án', unit: 'm²', plannedQty: 3800, startDay: 230, endDay: 265 },
  { name: 'Nghiệm thu PCCC toàn dự án (cơ quan chức năng)', discipline: 'Hạ tầng', block: 'Toàn dự án', unit: 'HT', plannedQty: 1, startDay: 250, endDay: 268, isCriticalPath: true },
  { name: 'Nghiệm thu, bàn giao Block A', discipline: 'Kết cấu', block: 'A', unit: 'HT', plannedQty: 1, startDay: 255, endDay: 273 },
  { name: 'Nghiệm thu, bàn giao Block B', discipline: 'Kết cấu', block: 'B', unit: 'HT', plannedQty: 1, startDay: 260, endDay: 273 },
]

const DELAY_NOTES = [
  'Chậm do ảnh hưởng thời tiết mưa kéo dài',
  'Chậm do chờ vật tư nhập khẩu về công trường',
  'Chậm do điều chỉnh thiết kế sau xử lý xung đột BIM',
  'Chậm do huy động nhân lực chưa đạt kế hoạch',
  'Chậm tiến độ, đang bổ sung ca thi công để bù tiến độ',
]
const ONTIME_NOTES = ['Đạt kế hoạch đề ra', 'Đúng tiến độ, không phát sinh', '']

function buildItem(t: ScheduleTemplate, index: number): ScheduleItem {
  const plannedStart = addDays(PROJECT_START, t.startDay)
  const plannedEnd = addDays(PROJECT_START, t.endDay)
  const hasStarted = ELAPSED_DAYS >= t.startDay

  if (!hasStarted) {
    return {
      id: `HM-${String(index + 1).padStart(3, '0')}`,
      name: t.name,
      discipline: t.discipline,
      block: t.block,
      unit: t.unit,
      plannedQty: t.plannedQty,
      actualQty: 0,
      plannedStart,
      plannedEnd,
      actualStart: null,
      actualEnd: null,
      percentComplete: 0,
      status: 'Chưa bắt đầu',
      delayDays: 0,
      note: '',
      isCriticalPath: Boolean(t.isCriticalPath),
    }
  }

  const isDelayed = chance(rng, 0.32)
  const delayDays = isDelayed ? randInt(rng, 3, 15) : 0
  const actualStart = addDays(plannedStart, isDelayed ? randInt(rng, 1, 4) : randInt(rng, -2, 1))
  const effectiveEndDay = t.endDay + delayDays
  const finished = ELAPSED_DAYS >= effectiveEndDay

  let percentComplete: number
  let actualEnd: Date | null
  let status: ScheduleStatus
  let actualQty: number

  if (finished) {
    percentComplete = 100
    actualEnd = addDays(PROJECT_START, effectiveEndDay)
    actualQty = t.plannedQty
    status = 'Hoàn thành'
  } else {
    const totalSpan = Math.max(1, effectiveEndDay - t.startDay)
    const elapsedSpan = ELAPSED_DAYS - t.startDay
    percentComplete = clamp(Math.round((elapsedSpan / totalSpan) * 100), 3, 97)
    actualEnd = null
    actualQty = Math.round((t.plannedQty * percentComplete) / 100)
    status = delayDays >= 3 ? 'Chậm tiến độ' : chance(rng, 0.12) ? 'Sớm tiến độ' : 'Đúng tiến độ'
  }

  const note =
    status === 'Chậm tiến độ' ? pick(rng, DELAY_NOTES) : pick(rng, ONTIME_NOTES)

  return {
    id: `HM-${String(index + 1).padStart(3, '0')}`,
    name: t.name,
    discipline: t.discipline,
    block: t.block,
    unit: t.unit,
    plannedQty: t.plannedQty,
    actualQty,
    plannedStart,
    plannedEnd,
    actualStart,
    actualEnd,
    percentComplete,
    status,
    delayDays: status === 'Chậm tiến độ' ? delayDays : 0,
    note,
    isCriticalPath: Boolean(t.isCriticalPath),
  }
}

export const scheduleItems: ScheduleItem[] = TEMPLATES.map(buildItem)

export const scheduleDayRange = {
  totalDays: Math.max(...TEMPLATES.map((t) => t.endDay)),
}
