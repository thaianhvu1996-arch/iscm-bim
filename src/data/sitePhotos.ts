import type { BlockId } from '../types'
import type { Lang } from '../i18n/LanguageContext'

export interface SitePhoto {
  id: string
  block: BlockId | 'Toàn dự án'
  location: Record<Lang, string>
  date: Date
  color: string
}

const PALETTE = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#9085e9', '#64748b', '#0ea5e9']

const ENTRIES: Array<[Record<Lang, string>, BlockId | 'Toàn dự án', Record<Lang, string>, [number, number, number]]> = [
  [{ vi: 'San nền & ép cọc', en: 'Grading & pile driving' }, 'A', { vi: 'Khu vực trục A-1 đến A-8', en: 'Grid A-1 to A-8 area' }, [2026, 8, 20]],
  [{ vi: 'Đài móng & đà kiềng', en: 'Footings & ground beams' }, 'A', { vi: 'Trục B-5', en: 'Grid B-5' }, [2026, 9, 10]],
  [{ vi: 'Ép cọc đại trà', en: 'Mass pile driving' }, 'B', { vi: 'Toàn bộ mặt bằng Block B', en: 'Entire Block B site' }, [2026, 9, 5]],
  [{ vi: 'Dựng cột thép', en: 'Erecting steel columns' }, 'A', { vi: 'Trục C-3 đến C-9', en: 'Grid C-3 to C-9' }, [2026, 10, 2]],
  [{ vi: 'Đài móng & đà kiềng', en: 'Footings & ground beams' }, 'C', { vi: 'Khu vực phía Bắc', en: 'Northern area' }, [2026, 10, 12]],
  [{ vi: 'Lắp vì kèo mái', en: 'Installing roof trusses' }, 'A', { vi: 'Nhịp giữa trục D-1', en: 'Mid-span at grid D-1' }, [2026, 10, 25]],
  [{ vi: 'Ép cọc đại trà', en: 'Mass pile driving' }, 'D', { vi: 'Khu vực trục A-1 đến A-10', en: 'Grid A-1 to A-10 area' }, [2026, 10, 28]],
  [{ vi: 'Trạm bơm PCCC & bể nước', en: 'Fire pump station & water tank' }, 'Toàn dự án', { vi: 'Khu kỹ thuật trung tâm', en: 'Central technical area' }, [2026, 9, 18]],
  [{ vi: 'Hạ tầng điện trung thế', en: 'Medium-voltage electrical infrastructure' }, 'Toàn dự án', { vi: 'Tuyến chính dọc đường nội bộ', en: 'Main run along the internal road' }, [2026, 9, 22]],
  [{ vi: 'Đài móng & đà kiềng', en: 'Footings & ground beams' }, 'B', { vi: 'Trục E-2 đến E-8', en: 'Grid E-2 to E-8' }, [2026, 10, 8]],
  [{ vi: 'Thoát nước mưa ngoài nhà', en: 'Outdoor stormwater drainage' }, 'Toàn dự án', { vi: 'Tuyến hố ga HG-01 đến HG-12', en: 'Manhole run HG-01 to HG-12' }, [2026, 9, 30]],
  [{ vi: 'Dựng cột thép', en: 'Erecting steel columns' }, 'B', { vi: 'Trục F-4 đến F-11', en: 'Grid F-4 to F-11' }, [2026, 11, 5]],
]

export const sitePhotos: SitePhoto[] = ENTRIES.map(([title, block, location, [y, m, d]], i) => ({
  id: `IMG-${String(i + 1).padStart(3, '0')}`,
  block,
  location: { vi: `${title.vi} - ${location.vi}`, en: `${title.en} - ${location.en}` },
  date: new Date(y, m, d),
  color: PALETTE[i % PALETTE.length],
})).sort((a, b) => b.date.getTime() - a.date.getTime())
