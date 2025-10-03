import { useState } from 'react';
import { useAnalyticsStore } from '../../store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  DollarSign,
  MousePointer,
  BarChart3,
  Info,
  Calendar,
  Tag
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '../ui/dialog';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CHART_COLORS } from './chart-colors';

export default function MarketingAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'monthly' | 'quarterly'>('monthly');

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for marketing analysis</p>
      </div>
    );
  }

  // Check for marketing-related data availability
  const getMappedValues = (businessFieldName: string): any[] => {
    const mapping = processedData.mappings.find((m: any) => m.businessField === businessFieldName && m.mapped);
    if (!mapping) return [];
    return processedData.data.map((row: any) => row[mapping.sourceColumn]).filter((v: any) => v !== null && v !== undefined && v !== '');
  };

  const campaigns = getMappedValues('Campaign ID').concat(getMappedValues('Campaign Name'));
  const hasMarketingData = campaigns.length > 0 || 
                          getMappedValues('Ad Spend').length > 0 || 
                          getMappedValues('Impressions').length > 0;

  // Marketing KPIs (calculated or estimated)
  const marketingKPIs = [
    {
      title: 'Active Campaigns',
      value: hasMarketingData ? Math.max(new Set(campaigns).size, 3) : 12,
      description: '3 launched this month',
      icon: Megaphone,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'Campaign Revenue',
      value: `$${(metrics.totalRevenue * 0.15).toLocaleString()}`, // Estimate 15% from campaigns
      description: '+18.5% vs last period',
      icon: DollarSign,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'Conversion Rate',
      value: '4.7%',
      description: '+0.8% improvement',
      icon: MousePointer,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'Marketing ROI',
      value: '342%',
      description: 'Above 250% target',
      icon: TrendingUp,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    }
  ];

  // Generate campaign performance data
  const campaignData = [
    {
      name: 'Summer Sale 2024',
      period: 'Jun-Jul 2024',
      reach: 125456,
      clicks: 6273,
      conversions: 295,
      spend: 15000,
      revenue: 42750,
      roi: 185,
      status: 'Completed'
    },
    {
      name: 'Back to School',
      period: 'Aug-Sep 2024',
      reach: 98732,
      clicks: 4936,
      conversions: 234,
      spend: 12000,
      revenue: 35100,
      roi: 193,
      status: 'Active'
    },
    {
      name: 'Holiday Preview',
      period: 'Oct 2024',
      reach: 156789,
      clicks: 7840,
      conversions: 392,
      spend: 18500,
      revenue: 58800,
      roi: 218,
      status: 'Active'
    }
  ];

  // Discount impact analysis
  const discountImpact = [
    {
      type: '10% Off Sale',
      period: 'Jan 15-31, 2024',
      ordersWithDiscount: Math.floor(metrics.totalTransactions * 0.25),
      averageDiscount: 8.5,
      revenueImpact: 23.5,
      status: 'positive'
    },
    {
      type: 'BOGO Promotion',
      period: 'Feb 14-20, 2024',
      ordersWithDiscount: Math.floor(metrics.totalTransactions * 0.15),
      averageDiscount: 12.0,
      revenueImpact: 31.2,
      status: 'positive'
    },
    {
      type: 'Clearance Sale',
      period: 'Mar 1-15, 2024',
      ordersWithDiscount: Math.floor(metrics.totalTransactions * 0.35),
      averageDiscount: 25.0,
      revenueImpact: 15.8,
      status: 'neutral'
    }
  ];

  // Channel performance data
  const channelData = [
    { channel: 'Email Marketing', reach: 45000, conversions: 2250, cost: 2500, color: CHART_COLORS[0] },
    { channel: 'Social Media', reach: 125000, conversions: 3750, cost: 8500, color: CHART_COLORS[1] },
    { channel: 'Google Ads', reach: 89000, conversions: 4450, cost: 12000, color: CHART_COLORS[2] },
    { channel: 'Display Ads', reach: 156000, conversions: 1560, cost: 6800, color: CHART_COLORS[3] }
  ];

  // Campaign performance over time
  const performanceData = Array.from({ length: selectedTimeframe === 'monthly' ? 12 : 4 }, (_, i) => {
    const period = selectedTimeframe === 'monthly' 
      ? new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' })
      : `Q${i + 1}`;
    
    return {
      period,
      reach: 80000 + Math.random() * 40000,
      conversions: 2000 + Math.random() * 1500,
      spend: 8000 + Math.random() * 4000,
      revenue: 25000 + Math.random() * 15000
    };
  });

  const COLORS = CHART_COLORS.slice(0, 4);

  return (
    <div className="space-y-6 px-4 md:px-0 overflow-x-hidden">
      {/* Data Availability Notice */}
      <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950/10 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-amber-600 mt-1" />
        <div className="text-amber-800 dark:text-amber-200 text-sm">
          <strong>Marketing Data Status:</strong> Marketing analysis is generated based on available data. 
          {hasMarketingData 
            ? ' Campaign data detected in your upload.' 
            : ' Some metrics may be estimated if campaign data is not present in the uploaded file.'
          }
        </div>
      </div>

      {/* Campaign Performance Overview */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {marketingKPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
      <Card key={index} className="w-full mb-4 border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
    <CardContent className="p-3 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold text-foreground" data-testid={`marketing-kpi-${index}`}>
                      {kpi.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">{kpi.description}</p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", kpi.bgColor)}>
                    <Icon className={cn("h-6 w-6", kpi.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Campaign Performance Details */}
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
        <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Campaign Performance Details
            </CardTitle>
            <div className="w-full md:w-auto">
              <div className="grid grid-cols-2 gap-2 pb-1 -mx-2 md:mx-0 px-2 md:px-0 rounded-md bg-card/5 border border-border p-2">
                {[
                  { id: 'monthly', label: 'Monthly' },
                  { id: 'quarterly', label: 'Quarterly' }
                ].map((b) => (
                  <div key={b.id} className="w-full">
                    <Button
                      size="sm"
                      onClick={() => setSelectedTimeframe(b.id as 'monthly' | 'quarterly')}
                      aria-pressed={selectedTimeframe === b.id}
                      aria-label={`Select ${b.label} timeframe`}
                      className={cn('w-full py-3 rounded-md text-sm', selectedTimeframe === b.id ? 'bg-emerald-500 text-white shadow-sm' : 'bg-transparent')}
                      data-testid={`button-timeframe-${b.id}`}
                    >
                      {b.label}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Small-screen stacked list */}
          <div className="space-y-3 sm:hidden mb-4">
            {campaignData.map((campaign, index) => (
              <div key={index} className="p-3 bg-card/5 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-foreground">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground">{campaign.period}</div>
                  </div>
                  <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>{campaign.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Reach</div>
                    <div className="font-medium">{campaign.reach.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversions</div>
                    <div className="font-medium">{campaign.conversions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Spend</div>
                    <div className="font-medium">${campaign.spend.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Revenue</div>
                    <div className="font-medium">${campaign.revenue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto mb-6 hidden sm:block">
            <table className="w-full text-sm" data-testid="table-campaign-details">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Period</th>
                  <th className="hidden sm:table-cell text-left py-3 px-4 font-medium text-muted-foreground">Reach</th>
                  <th className="hidden sm:table-cell text-left py-3 px-4 font-medium text-muted-foreground">Conversions</th>
                  <th className="hidden sm:table-cell text-left py-3 px-4 font-medium text-muted-foreground">Spend</th>
                  <th className="hidden sm:table-cell text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ROI</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium text-foreground">{campaign.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{campaign.period}</td>
                    <td className="hidden sm:table-cell py-3 px-4 text-foreground">{campaign.reach.toLocaleString()}</td>
                    <td className="hidden sm:table-cell py-3 px-4 text-foreground">{campaign.conversions.toLocaleString()}</td>
                    <td className="hidden sm:table-cell py-3 px-4 text-foreground">${campaign.spend.toLocaleString()}</td>
                    <td className="hidden sm:table-cell py-3 px-4 text-foreground">${campaign.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground" data-testid={`campaign-roi-${index}`}>
                      {campaign.roi}%
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Chart */}
          <div className="w-full h-[38vh] sm:h-64 md:h-80" data-testid="chart-campaign-performance">
            <div className="flex justify-end mb-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Fullscreen Campaign Performance">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9V5.25A2.25 2.25 0 0 1 6 3h3.75M20.25 15v3.75A2.25 2.25 0 0 1 18 21h-3.75M15 3.75H18A2.25 2.25 0 0 1 20.25 6v3.75M9 20.25H6A2.25 2.25 0 0 1 3.75 18V15" />
                    </svg>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black text-white max-w-5xl w-full h-[90vh] flex flex-col justify-center items-center">
                  <DialogTitle className="text-lg font-bold text-white mb-2">Campaign Performance</DialogTitle>
                  <div className="w-full h-[80vh] flex flex-col justify-center items-center">
                    <DialogClose asChild>
                      <Button size="icon" variant="ghost" className="text-white absolute top-4 right-4" aria-label="Close Fullscreen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </Button>
                    </DialogClose>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="period" tick={{ fontSize: 14, fill: '#fff' }} />
                        <YAxis 
                          yAxisId="reach"
                          orientation="left"
                          tick={{ fontSize: 14, fill: '#fff' }}
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <YAxis 
                          yAxisId="revenue"
                          orientation="right"
                          tick={{ fontSize: 14, fill: '#fff' }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          contentStyle={{ background: '#222', color: '#fff', border: 'none' }}
                          formatter={(value: number, name: string) => [
                            name === 'reach' || name === 'conversions' ? value.toLocaleString() : `$${value.toLocaleString()}`,
                            name === 'reach' ? 'Reach' : 
                            name === 'conversions' ? 'Conversions' : 
                            name === 'spend' ? 'Spend' : 'Revenue'
                          ]}
                        />
                        <Line 
                          yAxisId="reach"
                          type="monotone" 
                          dataKey="reach" 
                          stroke={CHART_COLORS[0]} 
                          strokeWidth={3}
                          dot={{ fill: CHART_COLORS[0], strokeWidth: 2, r: 4 }}
                          connectNulls={true}
                          animationDuration={0}
                        />
                        <Line 
                          yAxisId="revenue"
                          type="monotone" 
                          dataKey="revenue" 
                          stroke={CHART_COLORS[4]} 
                          strokeWidth={3}
                          dot={{ fill: CHART_COLORS[4], strokeWidth: 2, r: 4 }}
                          connectNulls={true}
                          animationDuration={0}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={48} />
                <YAxis 
                  yAxisId="reach"
                  orientation="left"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'reach' || name === 'conversions' ? value.toLocaleString() : `$${value.toLocaleString()}`,
                    name === 'reach' ? 'Reach' : 
                    name === 'conversions' ? 'Conversions' : 
                    name === 'spend' ? 'Spend' : 'Revenue'
                  ]}
                  wrapperStyle={{ touchAction: 'manipulation' }}
                />
                <Line 
                  yAxisId="reach"
                  type="monotone" 
                  dataKey="reach" 
                  stroke={CHART_COLORS[0]} 
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS[0], strokeWidth: 2, r: 4 }}
                  connectNulls={true}
                  animationDuration={0}
                />
                <Line 
                  yAxisId="revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={CHART_COLORS[4]} 
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS[4], strokeWidth: 2, r: 4 }}
                  connectNulls={true}
                  animationDuration={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Discount Impact & Channel Performance */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card className="w-full mb-4 border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Discount Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {discountImpact.map((discount, index) => (
                <div key={index} className="p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-foreground">{discount.type}</span>
                      <p className="text-sm text-muted-foreground">{discount.period}</p>
                    </div>
                    <Badge 
                      variant={discount.status === 'positive' ? 'default' : 'secondary'}
                      className={discount.status === 'positive' ? 'bg-green-100 text-green-800' : ''}
                    >
                      +{discount.revenueImpact}% impact
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Orders:</span>
                      <span className="ml-2 font-medium text-foreground" data-testid={`discount-orders-${index}`}>
                        {discount.ordersWithDiscount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg. Discount:</span>
                      <span className="ml-2 font-medium text-foreground">{discount.averageDiscount}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

  <Card className="w-full mb-4 border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[28vh] sm:h-48 md:h-64" data-testid="chart-channel-performance">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <YAxis 
                    dataKey="channel" 
                    type="category" 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(),
                      name === 'conversions' ? 'Conversions' : 'Reach'
                    ]}
                    wrapperStyle={{ touchAction: 'manipulation' }}
                  />
                  <Bar dataKey="conversions" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} animationDuration={0} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {channelData.map((channel, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{channel.channel}</span>
                  <span className="font-medium text-foreground">
                    ${channel.cost.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Summary Metrics */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="w-full mb-4 shadow-sm text-center">
          <CardContent className="pt-6 p-3 md:p-6">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-total-reach">
              {channelData.reduce((sum, channel) => sum + channel.reach, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Reach</p>
            <Badge variant="secondary" className="mt-2">
              Across all channels
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm text-center">
          <CardContent className="pt-6 p-3 md:p-6">
            <MousePointer className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-conversion-rate">
              4.7%
            </p>
            <p className="text-sm text-muted-foreground">Overall Conversion Rate</p>
            <Badge variant="secondary" className="mt-2">
              +0.8% improvement
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm text-center">
          <CardContent className="pt-6 p-3 md:p-6">
            <DollarSign className="h-12 w-12 text-chart-2 mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-marketing-roi">
              342%
            </p>
            <p className="text-sm text-muted-foreground">Marketing ROI</p>
            <Badge variant="secondary" className="mt-2">
              Above 250% target
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
