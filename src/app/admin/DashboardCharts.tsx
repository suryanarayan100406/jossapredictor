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
  const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  // Calculate total records for percentages in the legend
  const totalYearRecords = recordsByYear.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Records by Institute Type */}
      <div className="glass-panel border border-white/10 rounded-xl p-6 shadow-card">
        <h3 className="font-bold text-white text-base mb-6 font-display">Cutoffs by Institute Type</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recordsByType} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRecords" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} style={{ fontFamily: 'var(--font-mono)' }} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} style={{ fontFamily: 'var(--font-mono)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0c14',
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <Bar dataKey="value" name="Cutoff Records" fill="url(#colorRecords)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Records by Year (Donut with side legend to resolve overlapping text) */}
      <div className="glass-panel border border-white/10 rounded-xl p-6 shadow-card">
        <h3 className="font-bold text-white text-base mb-6 font-display">Data Distribution by Year</h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Donut Chart Container */}
          <div className="col-span-1 sm:col-span-7 h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={recordsByYear}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  label={false}
                >
                  {recordsByYear.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c14',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)'
                  }}
                  formatter={(value: any) => [value.toLocaleString('en-IN'), 'Records']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Clean Side Legend */}
          <div className="col-span-1 sm:col-span-5 space-y-3 pl-2 sm:border-l border-white/5">
            {recordsByYear.map((item, index) => {
              const color = COLORS[index % COLORS.length];
              const pct = totalYearRecords > 0 ? ((item.value / totalYearRecords) * 100).toFixed(0) : '0';
              return (
                <div key={item.name} className="flex items-center justify-between text-xs font-mono text-text-secondary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <div className="text-right pl-2">
                    <span className="text-[10px] text-text-muted mr-1.5">({pct}%)</span>
                    <span className="font-semibold text-white">{item.value.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 10 Branches */}
      <div className="glass-panel border border-white/10 rounded-xl p-6 shadow-card lg:col-span-2">
        <h3 className="font-bold text-white text-base mb-6 font-display">Top 10 Branches by Data Volume</h3>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topBranches}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorBranches" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} style={{ fontFamily: 'var(--font-mono)' }} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                width={90}
                tickFormatter={(value) => value.length > 15 ? value.substring(0, 12) + '...' : value}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0c14',
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <Bar dataKey="count" name="Cutoff Rows" fill="url(#colorBranches)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
