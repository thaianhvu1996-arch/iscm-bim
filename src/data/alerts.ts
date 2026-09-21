import type { AlertItem } from '../types'
import { clashes } from './clashes'
import { scheduleItems } from './schedule'
import { fieldChanges } from './fieldChanges'
import { CURRENT_DATE } from './constants'
import { BIM_TEAM, SITE_TEAM } from './people'

function buildAlerts(): AlertItem[] {
  const alerts: AlertItem[] = []

  const overdueA = clashes
    .filter(
      (c) =>
        (c.status === 'Mới' || c.status === 'Đang xử lý') &&
        c.severity === 'A' &&
        c.dueDate < CURRENT_DATE,
    )
    .sort((a, b) => b.estimatedCost - a.estimatedCost)

  overdueA.slice(0, 2).forEach((c) => {
    alerts.push({
      id: `CB-${c.id}`,
      level: 'Nghiêm trọng',
      title: {
        vi: `Xung đột nhóm A quá hạn xử lý (Block ${c.block}): ${c.description.vi}`,
        en: `Group A clash overdue (Block ${c.block}): ${c.description.en}`,
      },
      time: c.dueDate,
      assignee: c.assignee,
    })
  })

  const delayedCritical = scheduleItems
    .filter((s) => s.isCriticalPath && s.status === 'Chậm tiến độ')
    .sort((a, b) => b.delayDays - a.delayDays)

  delayedCritical.slice(0, 2).forEach((s) => {
    alerts.push({
      id: `CB-${s.id}`,
      level: 'Cảnh báo',
      title: {
        vi: `Hạng mục đường găng chậm tiến độ ${s.delayDays} ngày: ${s.name.vi}`,
        en: `Critical-path item delayed ${s.delayDays} days: ${s.name.en}`,
      },
      time: s.plannedEnd,
      assignee: SITE_TEAM[0].name,
    })
  })

  const pendingUpdates = fieldChanges.filter((f) => f.modelStatus === 'Chờ cập nhật')
  if (pendingUpdates.length > 0) {
    alerts.push({
      id: 'CB-TD',
      level: 'Thông tin',
      title: {
        vi: `${pendingUpdates.length} thay đổi hiện trường đang chờ cập nhật vào mô hình`,
        en: `${pendingUpdates.length} field changes pending model update`,
      },
      time: CURRENT_DATE,
      assignee: BIM_TEAM[1].name,
    })
  }

  const newClashesCount = clashes.filter((c) => c.status === 'Mới').length
  alerts.push({
    id: 'CB-XD-MOI',
    level: 'Thông tin',
    title: {
      vi: `${newClashesCount} xung đột mới phát hiện trong tuần cần phân công xử lý`,
      en: `${newClashesCount} new clashes detected this week need assignment`,
    },
    time: CURRENT_DATE,
    assignee: BIM_TEAM[0].name,
  })

  return alerts.slice(0, 5)
}

export const alerts: AlertItem[] = buildAlerts()
