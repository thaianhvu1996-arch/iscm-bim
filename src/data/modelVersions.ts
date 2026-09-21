import type { BlockId, ModelVersion } from '../types'
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

const NOTES = [
  'Cập nhật mô hình theo hồ sơ ép cọc & đài móng thực tế 4 block',
  'Tích hợp thay đổi hiện trường đợt 2 và kết quả xử lý xung đột kết cấu - MEP',
  'Cập nhật hệ kết cấu thép cột, kèo theo bản vẽ shop drawing đã duyệt',
  'Tích hợp thay đổi kiến trúc mái, cửa cuốn container theo yêu cầu chủ đầu tư',
  'Cập nhật tuyến MEP theo phương án xử lý xung đột đợt 3, đồng bộ hạ tầng ngoài nhà',
  'Cập nhật tổng hợp trước mốc báo cáo tiến độ tháng 12, rà soát toàn bộ 4 block',
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
