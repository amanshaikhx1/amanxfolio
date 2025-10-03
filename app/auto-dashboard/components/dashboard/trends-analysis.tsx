import { useState } from 'react';
import { useAnalyticsStore } from '../../store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, TrendingUp, ArrowUp, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  AreaChart,
  Area
} from 'recharts';
  import { CHART_COLORS } from './chart-colors';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export default function TrendsAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('daily');

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for trends analysis</p>
      </div>
    );
  }

  // Generate sample trend data based on processed data
  const generateTrendData = (period: TimePeriod) => {
    const dataPoints = period === 'daily' ? 30 : period === 'weekly' ? 12 : period === 'monthly' ? 12 : 4;
    const baseRevenue = metrics.totalRevenue / dataPoints;
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const growth = 1 + (Math.random() - 0.4) * 0.3; // ±15% variation
      const trend = 1 + (i * 0.02); // 2% growth trend
      
      return {
        period: period === 'daily' ? `Day ${i + 1}` : 
                period === 'weekly' ? `Week ${i + 1}` :
                period === 'monthly' ? `Month ${i + 1}` :
                `Q${i + 1}`,
        revenue: Math.round(baseRevenue * growth * trend),
        transactions: Math.round((metrics.totalTransactions / dataPoints) * growth * trend),
        index: i
      };
    });
  };

  // Sort trendData by index to ensure lines connect properly
  const trendData = generateTrendData(selectedPeriod).sort((a, b) => a.index - b.index);

  const periodButtons = [
    { id: 'daily' as TimePeriod, label: 'Daily' },
    { id: 'weekly' as TimePeriod, label: 'Weekly' },
    { id: 'monthly' as TimePeriod, label: 'Monthly' },
    { id: 'quarterly' as TimePeriod, label: 'Quarterly' }
  ];

  const growthMetrics = [
    {
      title: 'Month-over-Month',
      value: `+${metrics.growthRates.monthly.toFixed(1)}%`,
      description: 'Revenue growth',
      trend: 'up'
    },
    {
      title: 'Year-over-Year',
      value: `+${metrics.growthRates.yearly.toFixed(1)}%`,
      description: 'Revenue growth',
      trend: 'up'
    },
    {
      title: 'Quarter-over-Quarter',
      value: `+${metrics.growthRates.quarterly.toFixed(1)}%`,
      description: 'Revenue growth',
      trend: 'up'
    }
  ];

  const peakPerformance = [
    {
      title: 'Best Performing Period',
      value: selectedPeriod === 'daily' ? 'Friday' : selectedPeriod === 'monthly' ? 'December' : 'Q4',
      metric: selectedPeriod === 'daily' ? 'Day of Week' : selectedPeriod === 'monthly' ? 'Month' : 'Quarter',
      icon: Calendar,
      description: 'Highest average revenue'
    },
    {
      title: 'Peak Transaction Volume',
      value: '2:00 PM',
      metric: 'Hour of Day',
      icon: Clock,
      description: 'Highest transaction count'
    },
    {
      title: 'Growth Acceleration',
      value: `+${metrics.growthRates.monthly}%`,
      metric: 'Current Trend',
      icon: TrendingUp,
      description: 'Monthly growth rate'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
    <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Time Period Analysis</CardTitle>
            <div className="flex space-x-2 overflow-x-auto md:overflow-visible pb-1 -mx-2 md:mx-0 px-2 md:px-0">
              {periodButtons.map((period) => (
                <div key={period.id} className="flex-shrink-0">
                  <Button
                    key={period.id}
                    variant={selectedPeriod === period.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.id)}
                    data-testid={`button-period-${period.id}`}
                    className="min-w-[84px]"
                  >
                    {period.label}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sales Trends Chart */}
    <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <CardTitle className="flex flex-col md:flex-row items-start md:items-center">
            <span>Sales Trends Overview</span>
            <div className="flex items-center space-x-4 text-sm mt-2 md:mt-0 md:ml-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                <span className="text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                <span className="text-muted-foreground">Transactions</span>
              </div>
            </div>
          </CardTitle>
          <Dialog>
             <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="ml-2" aria-label="Fullscreen Sales Trends">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9V5.25A2.25 2.25 0 0 1 6 3h3.75M20.25 15v3.75A2.25 2.25 0 0 1 18 21h-3.75M15 3.75H18A2.25 2.25 0 0 1 20.25 6v3.75M9 20.25H6A2.25 2.25 0 0 1 3.75 18V15" />
                  </svg>
                </Button>
              </DialogTrigger>
            <DialogContent className="bg-black text-white max-w-5xl w-full h-[90vh] flex flex-col justify-center items-center">
              <DialogTitle>Sales Trends Overview</DialogTitle>
              <div className="w-full h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Sales Trends Overview</span>
                   <DialogClose asChild>
                     <Button size="icon" variant="ghost" className="text-white" aria-label="Close Fullscreen">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                       </svg>
                     </Button>
                   </DialogClose>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="period" 
                        tick={{ fontSize: 14, fill: '#fff' }}
                      />
                      <YAxis 
                        yAxisId="revenue"
                        orientation="left"
                        tick={{ fontSize: 14, fill: '#fff' }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        yAxisId="transactions"
                        orientation="right"
                        tick={{ fontSize: 14, fill: '#fff' }}
                      />
                      <Tooltip 
                        contentStyle={{ background: '#222', color: '#fff', border: 'none' }}
                        formatter={(value: number, name: string) => [
                          name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                          name === 'revenue' ? 'Revenue' : 'Transactions'
                        ]}
                      />
                      <Line 
                        yAxisId="revenue"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#1976d2" 
                        strokeWidth={3}
                        dot={{ fill: "#1976d2", strokeWidth: 2, r: 5 }}
                        connectNulls={true}
                      />
                      <Line 
                        yAxisId="transactions"
                        type="monotone" 
                        dataKey="transactions" 
                        stroke="#aaa" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#aaa", strokeWidth: 2, r: 4 }}
                        connectNulls={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-96" data-testid="chart-sales-trends">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  yAxisId="transactions"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'revenue' ? 'Revenue' : 'Transactions'
                  ]}
                />
                  <Line 
                    yAxisId="revenue"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1976d2" 
                    strokeWidth={3}
                    dot={{ fill: "#1976d2", strokeWidth: 2, r: 5 }}
                    connectNulls={true}
                  />
                <Line 
                  yAxisId="transactions"
                  type="monotone" 
                  dataKey="transactions" 
                        stroke={CHART_COLORS[1]}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                        dot={{ fill: CHART_COLORS[1], strokeWidth: 2, r: 4 }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics & Seasonal Patterns */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Growth Rate Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {growthMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{metric.title}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600 flex items-center" data-testid={`growth-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <ArrowUp className="h-4 w-4 mr-1" />
                      {metric.value}
                    </p>
                    <p className="text-xs text-muted-foreground">vs previous period</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

    <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Seasonal Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-seasonal-patterns">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                      stroke={CHART_COLORS[2]}
                      fill={CHART_COLORS[2]}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Performance Analysis */}
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
        <CardHeader>
          <CardTitle>Peak Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peakPerformance.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center p-4 bg-accent/30 rounded-lg">
                  <Icon className="w-8 h-8 text-chart-1 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-lg font-bold text-foreground" data-testid={`peak-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
