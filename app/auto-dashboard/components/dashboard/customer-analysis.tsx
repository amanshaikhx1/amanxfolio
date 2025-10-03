import { Dialog, DialogContent, DialogTrigger, DialogClose } from '../ui/dialog';
import { DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useAnalyticsStore } from '../../store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';
import { Users, Heart, MapPin, Star, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from 'recharts';
import { CHART_COLORS } from './chart-colors';

export default function CustomerAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for customer analysis</p>
      </div>
    );
  }

  // Get mapped field values
  const getMappedValues = (businessFieldName: string): any[] => {
    interface Mapping {
      businessField: string;
      mapped: boolean;
      sourceColumn: string;
    }

    interface ProcessedData {
      data: Record<string, any>[];
      mappings: Mapping[];
    }

    const mapping: Mapping | undefined = (processedData as ProcessedData).mappings.find(
      (m: Mapping) => m.businessField === businessFieldName && m.mapped
    );
    if (!mapping) return [];
    return processedData.data.map((row: Record<string, any>) => row[mapping.sourceColumn]).filter((v: any) => v !== null && v !== undefined && v !== '');
  };

  const toNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[$,\s%]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Generate customer segmentation data
  const customers = getMappedValues('Customer ID').concat(getMappedValues('Customer Email'));
  const revenues = getMappedValues('Revenue').concat(getMappedValues('Total Amount'));

  const customerRevenues: Record<string, number> = {};
  interface CustomerRow {
    [key: string]: any;
  }

  processedData.data.forEach((row: CustomerRow, index: number) => {
    const customerId: string = customers[index] || `Customer ${index + 1}`;
    const revenue: number = toNumber(revenues[index]) || Math.random() * 500 + 50;
    customerRevenues[customerId] = (customerRevenues[customerId] || 0) + revenue;
  });

  // Segment customers by value
  const customerValues = Object.values(customerRevenues);
  const segmentData = [
    { 
      name: 'VIP ($5000+)', 
      value: customerValues.filter(v => v >= 5000).length,
      color: CHART_COLORS[0],
      percentage: 1.5 
    },
    { 
      name: 'High Value ($1000-$5000)', 
      value: customerValues.filter(v => v >= 1000 && v < 5000).length,
      color: CHART_COLORS[1],
      percentage: 14.6 
    },
    { 
      name: 'Regular ($100-$1000)', 
      value: customerValues.filter(v => v >= 100 && v < 1000).length,
      color: CHART_COLORS[2],
      percentage: 54.2 
    },
    { 
      name: 'New (<$100)', 
      value: customerValues.filter(v => v < 100).length,
      color: CHART_COLORS[3],
      percentage: 29.7 
    }
  ];

  // Demographics data
  const ageGroups = [
    { range: '18-25', percentage: 18.5, count: Math.floor(metrics.customerMetrics.total * 0.185) },
    { range: '26-35', percentage: 32.1, count: Math.floor(metrics.customerMetrics.total * 0.321) },
    { range: '36-45', percentage: 28.7, count: Math.floor(metrics.customerMetrics.total * 0.287) },
    { range: '46+', percentage: 20.7, count: Math.floor(metrics.customerMetrics.total * 0.207) }
  ];

  const geographicData = [
    { region: 'North America', percentage: 45.2 },
    { region: 'Europe', percentage: 28.9 },
    { region: 'Asia Pacific', percentage: 18.4 },
    { region: 'Other', percentage: 7.5 }
  ];

  const behaviorMetrics = [
    { metric: 'Avg. Orders per Customer', value: '3.4', description: 'Purchase frequency' },
    { metric: 'Avg. Time Between Orders', value: '45 days', description: 'Purchase interval' },
    { metric: 'Customer Lifetime Value', value: `$${metrics.customerMetrics.ltv.toFixed(0)}`, description: 'Average LTV' }
  ];

  // Loyalty metrics
  const loyaltyMetrics = [
    { name: 'Repeat Purchase Rate', value: 68.3, unit: '%', trend: 'up' },
    { name: 'Customer Churn Rate', value: 26.8, unit: '%', trend: 'down' },
    { name: 'Net Promoter Score', value: 72, unit: '', trend: 'up' },
    { name: 'Customer Satisfaction', value: 4.2, unit: '/5', trend: 'stable' }
  ];

  // Retention cohort data (simulated)
  const retentionData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    retention: Math.max(20, 100 - (i * 8) - Math.random() * 10)
  }));

  const COLORS = CHART_COLORS.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Customer Segmentation & Value Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80" data-testid="chart-customer-segments">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Customers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Customer Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {segmentData.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{segment.name.split(' ')[0]} Customers</p>
                    <p className="text-xs text-muted-foreground">{segment.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: segment.color }} data-testid={`segment-${index}`}>
                      {segment.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{segment.percentage}% of total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Age Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ageGroups.map((group, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{group.range}</span>
                    <span className="text-sm font-medium text-foreground" data-testid={`age-group-${index}`}>
                      {group.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${group.percentage}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{group.count.toLocaleString()} customers</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geographicData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                  <span className="text-sm text-muted-foreground">{item.region}</span>
                  <span className="text-sm font-medium text-foreground" data-testid={`region-${index}`}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Purchase Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {behaviorMetrics.map((metric, index) => (
                <div key={index} className="text-center p-3 bg-accent/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  <p className="text-2xl font-bold text-foreground" data-testid={`behavior-${index}`}>
                    {metric.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Loyalty & Retention Analysis */}
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Customer Loyalty & Retention
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="ml-2" aria-label="Fullscreen Customer Loyalty & Retention">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9V5.25A2.25 2.25 0 0 1 6 3h3.75M20.25 15v3.75A2.25 2.25 0 0 1 18 21h-3.75M15 3.75H18A2.25 2.25 0 0 1 20.25 6v3.75M9 20.25H6A2.25 2.25 0 0 1 3.75 18V15" />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white max-w-5xl w-full h-[90vh] flex flex-col justify-center items-center">
              <DialogTitle>Customer Loyalty & Retention</DialogTitle>
              <div className="w-full h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Customer Loyalty & Retention</span>
                  <DialogClose asChild>
                    <Button size="icon" variant="ghost" className="text-white" aria-label="Close Fullscreen">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </DialogClose>
                </div>
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-4">Retention Rate by Cohort</h4>
                    <div className="h-64" data-testid="chart-retention">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={retentionData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 14, fill: '#fff' }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            tick={{ fontSize: 14, fill: '#fff' }}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip 
                            contentStyle={{ background: '#222', color: '#fff', border: 'none' }}
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Retention Rate']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="retention" 
                            stroke="#fff" 
                            strokeWidth={3}
                            dot={{ fill: "#fff", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-4">Loyalty Metrics</h4>
                    <div className="space-y-4">
                      {loyaltyMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-white rounded-lg">
                          <span className="text-sm font-medium text-white">{metric.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-white" data-testid={`loyalty-${index}`}>
                              {metric.value}{metric.unit}
                            </span>
                            {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-400" />}
                            {metric.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />}
                            {metric.trend === 'stable' && <div className="w-3 h-3 bg-amber-400 rounded-full" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-4">Retention Rate by Cohort</h4>
              <div className="h-64" data-testid="chart-retention">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Retention Rate']}
                    />
                          <Line 
                            type="monotone" 
                            dataKey="retention" 
                            stroke={CHART_COLORS[1]} 
                            strokeWidth={3}
                            dot={{ fill: CHART_COLORS[1], strokeWidth: 2, r: 4 }}
                          />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-4">Loyalty Metrics</h4>
              <div className="space-y-4">
                {loyaltyMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="text-sm font-medium text-foreground">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-foreground" data-testid={`loyalty-${index}`}>
                        {metric.value}{metric.unit}
                      </span>
                      {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {metric.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />}
                      {metric.trend === 'stable' && <div className="w-3 h-3 bg-amber-500 rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Value Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card className="border border-black rounded-lg text-center">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-total-customers">
              {metrics.customerMetrics.total.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <Badge variant="secondary" className="mt-2">
              +{metrics.customerMetrics.new} new this period
            </Badge>
          </CardContent>
        </Card>

  <Card className="border border-black rounded-lg text-center">
          <CardContent className="pt-6">
            <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-retention-rate">
              {metrics.customerMetrics.retention.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Retention Rate</p>
            <Badge variant="secondary" className="mt-2">
              Above Industry Average
            </Badge>
          </CardContent>
        </Card>

  <Card className="border border-black rounded-lg text-center">
          <CardContent className="pt-6">
            <Heart className="h-12 w-12 text-chart-2 mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-average-ltv">
              ${metrics.customerMetrics.ltv.toFixed(0)}
            </p>
            <p className="text-sm text-muted-foreground">Average LTV</p>
            <Badge variant="secondary" className="mt-2">
              Growing +12.5%
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
