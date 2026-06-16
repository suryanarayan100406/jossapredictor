import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  recordsByType: ChartData[];
  recordsByYear: ChartData[];
  topBranches: { name: string; count: number }[];
}

export function DashboardCharts({ recordsByType, recordsByYear, topBranches }: DashboardChartsProps) {
  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Records by Institute Type */}
      <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 backdrop-blur-md">
        <h3 className="font-bold text-white text-base mb-6">Cutoffs by Institute Type</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recordsByType} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#8888a0" fontSize={11} tickLine={false} />
              <YAxis stroke="#8888a0" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" name="Cutoff Records" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Records by Year */}
      <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 backdrop-blur-md">
        <h3 className="font-bold text-white text-base mb-6">Data Distribution by Year</h3>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={recordsByYear}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {recordsByYear.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 Branches */}
      <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 backdrop-blur-md lg:col-span-2">
        <h3 className="font-bold text-white text-base mb-6">Top 10 Branches by Data Volume</h3>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topBranches}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#8888a0" fontSize={11} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#8888a0"
                fontSize={10}
                tickLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" name="Cutoff Rows" fill="#ec4899" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
