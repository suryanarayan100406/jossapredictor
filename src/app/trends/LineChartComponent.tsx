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

export function LineChartComponent({ data }: { data: TrendRecord[] }) {
  // Extract unique years and rounds
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const rounds = Array.from(new Set(data.map(d => d.round))).sort();

  // Map rounds to chart points
  const chartData = rounds.map(r => {
    const row: any = { name: `Round ${r}` };
    years.forEach(y => {
      const match = data.find(d => d.year === y && d.round === r);
      if (match) {
        row[y.toString()] = match.closingRank;
      }
    });
    return row;
  });

  const colors = ['#ffffff', '#a1a1aa', '#71717a', '#3f3f46'];

  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="name"
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          <YAxis
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 1000', 'dataMax + 1000']}
            tickFormatter={(value) => value.toLocaleString('en-IN')}
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-default)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
            }}
            itemStyle={{ color: 'var(--text-primary)' }}
            labelStyle={{ color: 'var(--text-secondary)', fontWeight: 500 }}
            formatter={(value: any) => [value.toLocaleString('en-IN'), 'Closing Rank']}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 500 }} />
          {years.map((y, idx) => (
            <Line
              key={y}
              type="monotone"
              dataKey={y.toString()}
              name={`Year ${y}`}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1.5 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
