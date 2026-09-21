import {
  TrendingUp,
  CalendarDays,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  FileBarChart,
} from 'lucide-react'
import { KpiCard } from '../../components/common/KpiCard'
import { SCurveChart } from './SCurveChart'
import { BlockProgressChart } from './BlockProgressChart'
import { ClashPieChart } from './ClashPieChart'
import { AlertsPanel } from './AlertsPanel'
import {
  getOpenClashCount,
  getPreventedCost,
  getFieldChangesRecent,
  getTotalQuantityVariance,
} from '../../utils/metrics'
import {
  OVERALL_ACTUAL_PROGRESS,
  OVERALL_PLANNED_PROGRESS,
  REMAINING_DAYS,
  TOTAL_PROJECT_DAYS,
} from '../../data/constants'
import { MODEL_MATCH_RATE_AVG } from '../../data/modelVersions'
import { formatVNDShort, formatNumber } from '../../utils/format'
import { useLang } from '../../i18n/LanguageContext'

export function Dashboard() {
  const { lang } = useLang()
  const openClashes = getOpenClashCount()
  const preventedCost = getPreventedCost()
  const fieldChangesRecent = getFieldChangesRecent(30)
  const quantityVariance = getTotalQuantityVariance()
  const behindPlan = OVERALL_ACTUAL_PROGRESS < OVERALL_PLANNED_PROGRESS

  return (
    <div className="grid grid-cols-2 grid-flow-row-dense gap-4 p-6 md:grid-cols-4 lg:grid-cols-6">
      {/* Ô lớn (hero) - con số bán hàng quan trọng nhất */}
      <div className="glass glass-hover animate-countup col-span-2 row-span-2 flex flex-col justify-between rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/60">
            {lang === 'vi' ? 'Chi phí rủi ro đã ngăn ngừa' : 'Risk cost prevented'}
          </p>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-success/15 text-status-success">
            <ShieldCheck size={20} />
          </div>
        </div>
        <div>
          <p className="font-heading text-4xl font-bold text-status-success">{formatVNDShort(preventedCost, lang)}</p>
          <p className="mt-2 text-xs leading-relaxed text-white/45">
            {lang === 'vi'
              ? 'Tổng chi phí ước tính của các xung đột nhóm A, B đã phát hiện và xử lý qua mô hình BIM trước khi thi công.'
              : 'Total estimated cost of Group A/B clashes detected and resolved on the BIM model before construction.'}
          </p>
        </div>
      </div>

      <KpiCard
        label={lang === 'vi' ? 'Tiến độ tổng thể' : 'Overall progress'}
        value={`${OVERALL_ACTUAL_PROGRESS}%`}
        icon={<TrendingUp size={16} />}
        accent={behindPlan ? 'warning' : 'success'}
        sub={`${lang === 'vi' ? 'Kế hoạch' : 'Planned'}: ${OVERALL_PLANNED_PROGRESS}%`}
      />
      <KpiCard
        label={lang === 'vi' ? 'Số ngày còn lại' : 'Days remaining'}
        value={lang === 'vi' ? `${formatNumber(REMAINING_DAYS)} ngày` : `${formatNumber(REMAINING_DAYS)} days`}
        icon={<CalendarDays size={16} />}
        accent="neutral"
        sub={
          lang === 'vi'
            ? `Tổng ${formatNumber(TOTAL_PROJECT_DAYS)} ngày thi công`
            : `${formatNumber(TOTAL_PROJECT_DAYS)} days total`
        }
      />
      <KpiCard
        label={lang === 'vi' ? 'Xung đột chưa xử lý' : 'Open clashes'}
        value={formatNumber(openClashes)}
        icon={<AlertTriangle size={16} />}
        accent="warning"
        sub={lang === 'vi' ? 'Mới + Đang xử lý' : 'New + In progress'}
      />
      <KpiCard
        label={lang === 'vi' ? 'Thay đổi hiện trường (30 ngày)' : 'Field changes (30 days)'}
        value={formatNumber(fieldChangesRecent)}
        icon={<RefreshCw size={16} />}
        accent="info"
        sub={lang === 'vi' ? 'Đã ghi nhận vào mô hình' : 'Logged into the model'}
      />
      <KpiCard
        label={lang === 'vi' ? 'Mô hình khớp hiện trạng' : 'Model-to-site match'}
        value={`${MODEL_MATCH_RATE_AVG}%`}
        icon={<CheckCircle2 size={16} />}
        accent="success"
        sub={lang === 'vi' ? 'Trung bình 4 block' : 'Average across 4 blocks'}
      />
      <KpiCard
        label={lang === 'vi' ? 'Chênh lệch khối lượng phát hiện' : 'Quantity variance detected'}
        value={formatVNDShort(quantityVariance, lang)}
        icon={<FileBarChart size={16} />}
        accent="brand"
        sub={lang === 'vi' ? 'Đối chiếu hợp đồng vs mô hình (5D)' : 'Contract vs. model (5D)'}
      />

      <div className="glass col-span-2 rounded-2xl p-4 md:col-span-4">
        <p className="mb-3 text-sm font-semibold text-white/85">
          {lang === 'vi' ? 'Tiến độ kế hoạch và thực tế (S-curve)' : 'Planned vs. actual progress (S-curve)'}
        </p>
        <div className="h-64">
          <SCurveChart />
        </div>
      </div>

      <div className="col-span-2 row-span-2">
        <AlertsPanel />
      </div>

      <div className="glass col-span-2 rounded-2xl p-4">
        <p className="mb-3 text-sm font-semibold text-white/85">
          {lang === 'vi' ? 'Tiến độ theo block' : 'Progress by block'}
        </p>
        <div className="h-52">
          <BlockProgressChart />
        </div>
      </div>
      <div className="glass col-span-2 rounded-2xl p-4">
        <p className="mb-3 text-sm font-semibold text-white/85">
          {lang === 'vi' ? 'Xung đột theo cặp bộ môn' : 'Clashes by discipline pair'}
        </p>
        <div className="h-52">
          <ClashPieChart />
        </div>
      </div>
    </div>
  )
}
