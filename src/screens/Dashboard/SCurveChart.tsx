import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import { getSCurveWeeklyData } from '../../utils/metrics'
import { STATUS_COLORS } from '../../data/constants'
import { ChartTooltip } from '../../components/common/ChartTooltip'
import { useLang } from '../../i18n/LanguageContext'

export function SCurveChart() {
  const { lang } = useLang()
  const raw = getSCurveWeeklyData()
  const data = raw.map((p) => ({
    ...p,
    gap: p.thuc_te !== null ? Math.max(0, p.ke_hoach - p.thuc_te) : 0,
  }))
  const lastActual = [...data].reverse().find((p) => p.thuc_te !== null)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid stroke="#1e2c4a" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={{ stroke: '#1e2c4a' }}
          tickLine={false}
          interval={4}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
          formatter={(value: string) => <span className="text-white/60">{value}</span>}
        />
        {lastActual && (
          <ReferenceLine
            x={lastActual.label}
            stroke="#64748b"
            strokeDasharray="2 2"
            label={{
              value: lang === 'vi' ? 'Hôm nay' : 'Today',
              position: 'insideTopRight',
              fill: '#64748b',
              fontSize: 11,
            }}
          />
        )}
        <Area
          dataKey="thuc_te"
          stackId="a"
          stroke="none"
          fill="transparent"
          isAnimationActive={false}
          legendType="none"
          name=""
        />
        <Area
          dataKey="gap"
          stackId="a"
          stroke="none"
          fill={STATUS_COLORS.warning}
          fillOpacity={0.15}
          isAnimationActive={false}
          legendType="none"
          name=""
        />
        <Line
          dataKey="ke_hoach"
          name={lang === 'vi' ? 'Kế hoạch' : 'Planned'}
          stroke={STATUS_COLORS.neutral}
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          dataKey="thuc_te"
          name={lang === 'vi' ? 'Thực tế' : 'Actual'}
          stroke={STATUS_COLORS.info}
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
