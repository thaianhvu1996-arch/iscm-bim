import type { BlockId } from '../types'

export interface SitePhoto {
  id: string
  block: BlockId | 'Toàn dự án'
  location: string
  date: Date
  color: string
}

const PALETTE = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#9085e9', '#64748b', '#0ea5e9']

const ENTRIES: Array<[string, BlockId | 'Toàn dự án', string, [number, number, number]]> = [
  ['San nền & ép cọc', 'A', 'Khu vực trục A-1 đến A-8', [2026, 8, 20]],
  ['Đài móng & đà kiềng', 'A', 'Trục B-5', [2026, 9, 10]],
  ['Ép cọc đại trà', 'B', 'Toàn bộ mặt bằng Block B', [2026, 9, 5]],
  ['Dựng cột thép', 'A', 'Trục C-3 đến C-9', [2026, 10, 2]],
  ['Đài móng & đà kiềng', 'C', 'Khu vực phía Bắc', [2026, 10, 12]],
  ['Lắp vì kèo mái', 'A', 'Nhịp giữa trục D-1', [2026, 10, 25]],
  ['Ép cọc đại trà', 'D', 'Khu vực trục A-1 đến A-10', [2026, 10, 28]],
  ['Trạm bơm PCCC & bể nước', 'Toàn dự án', 'Khu kỹ thuật trung tâm', [2026, 9, 18]],
  ['Hạ tầng điện trung thế', 'Toàn dự án', 'Tuyến chính dọc đường nội bộ', [2026, 9, 22]],
  ['Đài móng & đà kiềng', 'B', 'Trục E-2 đến E-8', [2026, 10, 8]],
  ['Thoát nước mưa ngoài nhà', 'Toàn dự án', 'Tuyến hố ga HG-01 đến HG-12', [2026, 9, 30]],
  ['Dựng cột thép', 'B', 'Trục F-4 đến F-11', [2026, 11, 5]],
]

export const sitePhotos: SitePhoto[] = ENTRIES.map(([title, block, location, [y, m, d]], i) => ({
  id: `IMG-${String(i + 1).padStart(3, '0')}`,
  block,
  location: `${title} - ${location}`,
  date: new Date(y, m, d),
  color: PALETTE[i % PALETTE.length],
})).sort((a, b) => b.date.getTime() - a.date.getTime())
