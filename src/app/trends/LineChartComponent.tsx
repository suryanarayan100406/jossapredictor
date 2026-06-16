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

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            stroke="#8888a0"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#8888a0"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 1000', 'dataMax + 1000']}
            tickFormatter={(value) => value.toLocaleString('en-IN')}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#12121a',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#8888a0', fontWeight: 'bold' }}
            formatter={(value: any) => [value.toLocaleString('en-IN'), 'Closing Rank']}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          {years.map((y, idx) => (
            <Line
              key={y}
              type="monotone"
              dataKey={y.toString()}
              name={`Year ${y}`}
              stroke={colors[idx % colors.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
