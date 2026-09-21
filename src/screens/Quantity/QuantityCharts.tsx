import type { ReactNode } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Cell,
} from 'recharts'
import { getQuantityByGroup, getCostCurveData, getTopCostVarianceItems } from '../../utils/metrics'
import { STATUS_COLORS } from '../../data/constants'
import { ChartTooltip } from '../../components/common/ChartTooltip'
import { formatVNDShort } from '../../utils/format'
import { useLang } from '../../i18n/LanguageContext'
import { quantityGroupLabel } from '../../i18n/labels'
import type { QuantityGroup } from '../../data/quantities'

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="mb-3 text-xs font-semibold text-white/60">{title}</p>
      <div className="h-56">{children}</div>
    </div>
  )
}

export function QuantityCharts() {
  const { lang } = useLang()
  const byGroup = getQuantityByGroup().map((g) => ({
    ...g,
    group: quantityGroupLabel(g.group as QuantityGroup, lang),
  }))
  const costCurve = getCostCurveData()
  const topVariance = getTopCostVarianceItems(10).map((i) => ({
    name: i.id,
    fullName: i.name[lang],
    value: i.costImpact,
  }))

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Panel
        title={
          lang === 'vi'
            ? 'Khối lượng hợp đồng vs mô hình theo nhóm công tác'
            : 'Contract vs. model quantity by work group'
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byGroup} margin={{ top: 4, right: 8, left: 0, bottom: 28 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="group"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={(v: number) => formatVNDShort(v, lang)}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={54}
            />
            <Tooltip content={<ChartTooltip formatter={(item) => formatVNDShort(Number(item.value), lang)} />} cursor={{ fill: '#ffffff', fillOpacity: 0.04 }} />
            <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }} />
            <Bar
              dataKey="hop_dong"
              name={lang === 'vi' ? 'Hợp đồng' : 'Contract'}
              fill="rgba(255,255,255,0.35)"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="mo_hinh"
              name={lang === 'vi' ? 'Mô hình' : 'Model'}
              fill={STATUS_COLORS.info}
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel
        title={lang === 'vi' ? 'Đường cong chi phí luỹ kế - dự toán vs thực tế' : 'Cumulative cost curve - estimate vs. actual'}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={costCurve} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} tickLine={false} interval={5} />
            <YAxis
              tickFormatter={(v: number) => formatVNDShort(v, lang)}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={54}
            />
            <Tooltip content={<ChartTooltip formatter={(item) => formatVNDShort(Number(item.value), lang)} />} />
            <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }} />
            <Line
              type="monotone"
              dataKey="ke_hoach"
              name={lang === 'vi' ? 'Dự toán' : 'Estimate'}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="thuc_te"
              name={lang === 'vi' ? 'Thực tế' : 'Actual'}
              stroke={STATUS_COLORS.info}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title={lang === 'vi' ? 'Top 10 hạng mục chênh lệch chi phí lớn nhất' : 'Top 10 items by cost variance'}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topVariance} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(v: number) => formatVNDShort(v, lang)} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} axisLine={false} tickLine={false} width={54} />
            <Tooltip
              content={
                <ChartTooltip
                  formatter={(item) => formatVNDShort(Number(item.value), lang)}
                />
              }
              cursor={{ fill: '#ffffff', fillOpacity: 0.04 }}
            />
            <Bar dataKey="value" name={lang === 'vi' ? 'Ảnh hưởng chi phí' : 'Cost impact'} radius={[0, 3, 3, 0]} isAnimationActive={false}>
              {topVariance.map((d, i) => (
                <Cell key={i} fill={d.value >= 0 ? STATUS_COLORS.warning : STATUS_COLORS.info} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  )
}
