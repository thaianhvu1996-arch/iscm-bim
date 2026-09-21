import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { getClashByDisciplinePair, disciplinePairColor } from '../../utils/metrics'
import { ChartTooltip } from '../../components/common/ChartTooltip'
import { useLang } from '../../i18n/LanguageContext'
import { disciplineLabel } from '../../i18n/labels'

export function ClashPieChart() {
  const { lang } = useLang()
  const data = getClashByDisciplinePair().map((d) => ({
    ...d,
    displayName: `${disciplineLabel(d.a, lang)} – ${disciplineLabel(d.b, lang)}`,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="displayName"
          cx="38%"
          cy="50%"
          innerRadius="52%"
          outerRadius="85%"
          paddingAngle={2}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={disciplinePairColor(entry.name)} stroke="#0d1526" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          content={<ChartTooltip formatter={(item) => `${item.value} ${lang === 'vi' ? 'xung đột' : 'clashes'}`} />}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11.5, color: '#94a3b8', lineHeight: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
