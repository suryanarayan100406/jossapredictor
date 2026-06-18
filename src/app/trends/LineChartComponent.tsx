import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface TrendRecord {
  year: number;
  round: number;
  closingRank: number;
  openingRank: number;
}

const colors = ['#4f46e5', '#06b6d4', '#ec4899', '#16a34a', '#ea9209'];

const chartMargin = { top: 8, right: 16, left: 8, bottom: 4 };
const axisStyle = { fontFamily: 'var(--font-display)', fontWeight: 600 };
const tooltipContentStyle = {
  background: '#ffffff',
  border: '1px solid #e3e9f2',
  borderRadius: 16,
  boxShadow: '0 12px 32px -12px rgba(24,33,58,0.25)',
  fontFamily: 'var(--font-display)',
  fontSize: 12,
};
const tooltipItemStyle = { color: '#18213a', fontWeight: 600 };
const tooltipLabelStyle = { color: '#55617a', fontWeight: 700, marginBottom: 4 };
const legendWrapperStyle = { fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600 };
const lineDot = { r: 3, strokeWidth: 2 };
const lineActiveDot = { r: 6, strokeWidth: 0 };

export function LineChartComponent({ data }: { data: TrendRecord[] }) {
  const years = Array.from(new Set(data.map((d) => d.year))).sort();
  const rounds = Array.from(new Set(data.map((d) => d.round))).sort();

  const chartData = rounds.map((r) => {
    const row: any = { name: `Round ${r}` };
    years.forEach((y) => {
      const match = data.find((d) => d.year === y && d.round === r);
      if (match) {
        row[y.toString()] = match.closingRank;
      }
    });
    return row;
  });

  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" />
          <XAxis dataKey="name" stroke="#94a0b4" fontSize={11} tickLine={false} axisLine={false} style={axisStyle} />
          <YAxis
            stroke="#94a0b4"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={65}
            domain={['dataMin - 1000', 'dataMax + 1000']}
            tickFormatter={(value) => value.toLocaleString('en-IN')}
            style={axisStyle}
          />
          <Tooltip
            contentStyle={tooltipContentStyle}
            itemStyle={tooltipItemStyle}
            labelStyle={tooltipLabelStyle}
            formatter={(value: any) => [value.toLocaleString('en-IN'), 'Closing rank']}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={legendWrapperStyle} />
          {years.map((y, idx) => (
            <Line
              key={y}
              type="monotone"
              dataKey={y.toString()}
              name={`Year ${y}`}
              stroke={colors[idx % colors.length]}
              strokeWidth={3}
              dot={lineDot}
              activeDot={lineActiveDot}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
