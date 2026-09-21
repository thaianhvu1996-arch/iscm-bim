import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { getBlockProgressData } from '../../utils/metrics'
import { STATUS_COLORS } from '../../data/constants'
import { ChartTooltip } from '../../components/common/ChartTooltip'
import { useLang } from '../../i18n/LanguageContext'

export function BlockProgressChart() {
  const { lang } = useLang()
  const data = getBlockProgressData()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid stroke="#1e2c4a" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="block"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={{ stroke: '#1e2c4a' }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          content={<ChartTooltip formatter={(item) => `${item.value}%`} />}
          cursor={{ fill: '#ffffff', fillOpacity: 0.03 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
          formatter={(value: string) => <span className="text-white/60">{value}</span>}
        />
        <Bar
          dataKey="hoan_thanh"
          stackId="a"
          name={lang === 'vi' ? 'Đã hoàn thành' : 'Completed'}
          fill={STATUS_COLORS.info}
          radius={[0, 0, 0, 0]}
          isAnimationActive={false}
        />
        <Bar
          dataKey="con_lai"
          stackId="a"
          name={lang === 'vi' ? 'Còn lại' : 'Remaining'}
          fill="#1e2c4a"
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
