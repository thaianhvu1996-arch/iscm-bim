import type { BlockId, ModelVersion } from '../types'
import type { Lang } from '../i18n/LanguageContext'
import { BLOCK_IDS } from './constants'
import { BIM_TEAM } from './people'
import { fieldChanges } from './fieldChanges'

const VERSION_DATES = [
  new Date(2026, 8, 15),
  new Date(2026, 8, 30),
  new Date(2026, 9, 15),
  new Date(2026, 9, 30),
  new Date(2026, 10, 15),
  new Date(2026, 11, 1),
]

const AUTHORS = [
  BIM_TEAM[1].name,
  BIM_TEAM[2].name,
  BIM_TEAM[0].name,
  BIM_TEAM[3].name,
  BIM_TEAM[4].name,
  BIM_TEAM[0].name,
]

const NOTES: Array<Record<Lang, string>> = [
  {
    vi: 'Cập nhật mô hình theo hồ sơ ép cọc & đài móng thực tế 4 block',
    en: 'Updated the model per actual pile-driving and footing records for all 4 blocks',
  },
  {
    vi: 'Tích hợp thay đổi hiện trường đợt 2 và kết quả xử lý xung đột kết cấu - MEP',
    en: 'Integrated round-2 field changes and structure–MEP clash resolutions',
  },
  {
    vi: 'Cập nhật hệ kết cấu thép cột, kèo theo bản vẽ shop drawing đã duyệt',
    en: 'Updated the steel column and truss structure per approved shop drawings',
  },
  {
    vi: 'Tích hợp thay đổi kiến trúc mái, cửa cuốn container theo yêu cầu chủ đầu tư',
    en: 'Integrated roof and container-shutter architectural changes per investor request',
  },
  {
    vi: 'Cập nhật tuyến MEP theo phương án xử lý xung đột đợt 3, đồng bộ hạ tầng ngoài nhà',
    en: 'Updated MEP routing per round-3 clash resolutions, synced with outdoor infrastructure',
  },
  {
    vi: 'Cập nhật tổng hợp trước mốc báo cáo tiến độ tháng 12, rà soát toàn bộ 4 block',
    en: 'Consolidated update ahead of the December progress report, reviewed all 4 blocks',
  },
]

function countChangesInRange(from: Date, to: Date): number {
  return fieldChanges.filter(
    (c) => c.modelStatus === 'Đã cập nhật' && c.date > from && c.date <= to,
  ).length
}

function generateModelVersions(): ModelVersion[] {
  const projectStartBoundary = new Date(2026, 7, 15)
  return VERSION_DATES.map((date, i) => {
    const from = i === 0 ? projectStartBoundary : VERSION_DATES[i - 1]
    return {
      version: `v1.${i}`,
      date,
      changesIntegrated: countChangesInRange(from, date),
      author: AUTHORS[i],
      note: NOTES[i],
    }
  })
}

export const modelVersions: ModelVersion[] = generateModelVersions()

// Mức độ trùng khớp mô hình với hiện trạng theo từng block (%)
export const MODEL_MATCH_RATE: Record<BlockId, number> = {
  A: 97,
  B: 95,
  C: 93,
  D: 90,
}

export const MODEL_MATCH_RATE_AVG = Math.round(
  BLOCK_IDS.reduce((sum, b) => sum + MODEL_MATCH_RATE[b], 0) / BLOCK_IDS.length,
)
