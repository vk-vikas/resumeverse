'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

interface ViewRecord {
  id: string;
  resume_id: string;
  viewed_at: string;
  referrer: string;
  user_agent: string;
}

interface AnalyticsChartsProps {
  views: ViewRecord[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsCharts({ views }: AnalyticsChartsProps) {
  // 1. Process Time Series Data (Last 30 Days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = subDays(new Date(), 29 - i);
    return {
      dateStr: format(d, 'yyyy-MM-dd'),
      display: format(d, 'MMM dd'),
      views: 0
    };
  });

  const viewsByDate = views.reduce((acc, view) => {
    const dateStr = view.viewed_at.split('T')[0];
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const timeSeriesData = last30Days.map(day => ({
    name: day.display,
    Views: viewsByDate[day.dateStr] || 0
  }));

  // 2. Process Referrer Data
  const referrers = views.reduce((acc, view) => {
    let source = view.referrer || 'Direct';
    
    // Normalize common sources
    if (source.includes('linkedin.com') || source.includes('lnkd.in')) source = 'LinkedIn';
    else if (source.includes('twitter.com') || source.includes('t.co') || source.includes('x.com')) source = 'Twitter / X';
    else if (source.includes('google.com')) source = 'Google';
    else if (source.includes('github.com')) source = 'GitHub';
    else if (source !== 'Direct') {
      try {
        source = new URL(source).hostname.replace('www.', '');
      } catch (e) {
        // Fallback for invalid URLs
      }
    }

    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const referrerData = Object.entries(referrers)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5

  // 3. Process Device Data
  const devices = views.reduce((acc, view) => {
    const ua = view.user_agent.toLowerCase();
    let type = 'Desktop';
    if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone')) {
      type = 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      type = 'Tablet';
    } else if (ua === 'unknown') {
      type = 'Unknown';
    }
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceData = Object.entries(devices).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      {/* Time Series Context */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-6">Views Over Time (30 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#525252" 
                tick={{ fill: '#a3a3a3', fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                stroke="#525252" 
                tick={{ fill: '#a3a3a3', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="Views" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#171717', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Referrer Chart */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-6">Top Traffic Sources</h3>
          {referrerData.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referrerData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                  <XAxis type="number" stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 12 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="#525252" tick={{ fill: '#e5e5e5', fontSize: 12 }} width={80} />
                  <Tooltip 
                    cursor={{ fill: '#262626' }}
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="value" name="Views" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-[250px] flex items-center justify-center text-neutral-500">Not enough data</div>
          )}
        </div>

        {/* Device Chart */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-semibold text-white mb-2 w-full text-left">Device Breakdown</h3>
          {deviceData.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a3a3a3' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] w-full flex items-center justify-center text-neutral-500">Not enough data</div>
          )}
        </div>
      </div>
    </div>
  );
}
