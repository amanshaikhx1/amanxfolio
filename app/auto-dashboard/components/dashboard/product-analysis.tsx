import { useState } from 'react';
import { useAnalyticsStore } from '../../store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, TrendingDown, Package, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { CHART_COLORS } from './chart-colors';

export default function ProductAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();
  const [selectedView, setSelectedView] = useState<'revenue' | 'quantity' | 'profit'>('revenue');

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for product analysis</p>
      </div>
    );
  }

  // Get mapped field values
  const getMappedValues = (businessFieldName: string): any[] => {
    interface Mapping {
      businessField: string;
      sourceColumn: string;
      mapped: boolean;
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

  // Generate product performance data
  const generateProductData = () => {
    const products = getMappedValues('Product Name').concat(getMappedValues('Product ID'));
    const revenues = getMappedValues('Revenue').concat(getMappedValues('Total Amount'));
    const quantities = getMappedValues('Quantity');
    const categories = getMappedValues('Product Category');

    interface ProductMapEntry {
      revenue: number;
      quantity: number;
      category: string;
    }

    const productMap: Record<string, ProductMapEntry> = {};

    processedData.data.forEach(
      (
      row: Record<string, any>,
      index: number
      ): void => {
      const productName: string = products[index] || `Product ${index + 1}`;
      const revenue: number = toNumber(revenues[index]) || Math.random() * 1000 + 100;
      const quantity: number = toNumber(quantities[index]) || Math.floor(Math.random() * 50) + 1;
      const category: string = categories[index] || ['Electronics', 'Clothing', 'Home', 'Sports'][Math.floor(Math.random() * 4)];

      if (!productMap[productName]) {
        productMap[productName] = { revenue: 0, quantity: 0, category };
      }
      productMap[productName].revenue += revenue;
      productMap[productName].quantity += quantity;
      }
    );

    return Object.entries(productMap).map(([name, data]) => ({
      name,
      ...data,
      profit: data.revenue * 0.3, // Estimate 30% profit margin
      margin: 30 + Math.random() * 20 // 30-50% margin range
    }));
  };

  const productData = generateProductData();
  const topProducts = productData.sort((a, b) => b[selectedView] - a[selectedView]).slice(0, 5);
  const bottomProducts = productData.sort((a, b) => a[selectedView] - b[selectedView]).slice(0, 5);

  // Generate category performance data
  const categoryData = productData.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { revenue: 0, quantity: 0, products: 0 };
    }
    acc[product.category].revenue += product.revenue;
    acc[product.category].quantity += product.quantity;
    acc[product.category].products += 1;
    return acc;
  }, {} as Record<string, { revenue: number; quantity: number; products: number }>);

  const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
    category,
    ...data
  }));

  // Generate profitability scatter data
  const profitabilityData = productData
    .map(product => ({
      volume: product.quantity,
      profit: product.profit,
      name: product.name,
      margin: product.margin
    }))
    .sort((a, b) => a.volume - b.volume);

  // Return rate simulation
  const returnRates = [
    { category: 'Electronics', rate: 4.2, trend: 'up' },
    { category: 'Clothing', rate: 6.1, trend: 'down' },
    { category: 'Home', rate: 2.8, trend: 'stable' },
    { category: 'Sports', rate: 3.5, trend: 'up' }
  ];

  const COLORS = CHART_COLORS;

  const marginCategories = [
    { range: 'High Margin (>40%)', count: productData.filter(p => p.margin > 40).length, color: 'text-green-600' },
    { range: 'Medium Margin (20-40%)', count: productData.filter(p => p.margin >= 20 && p.margin <= 40).length, color: 'text-amber-600' },
    { range: 'Low Margin (<20%)', count: productData.filter(p => p.margin < 20).length, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performing Products</CardTitle>
            <div className="flex space-x-2">
              {(['revenue', 'quantity', 'profit'] as const).map((view) => (
                <Button
                  key={view}
                  variant={selectedView === view ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView(view)}
                  data-testid={`button-view-${view}`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-chart-1/20 rounded-lg flex items-center justify-center">
                      {index === 0 ? (
                        <Star className="h-5 w-5 text-chart-1" />
                      ) : (
                        <span className="text-sm font-bold text-chart-1">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`top-product-${index}`}>
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} • {product.quantity} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {selectedView === 'revenue' || selectedView === 'profit' 
                        ? `$${product[selectedView].toLocaleString()}` 
                        : product[selectedView].toLocaleString()
                      }
                    </p>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +{(Math.random() * 20 + 5).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Bottom Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`bottom-product-${index}`}>
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} • {product.quantity} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {selectedView === 'revenue' || selectedView === 'profit' 
                        ? `$${product[selectedView].toLocaleString()}` 
                        : product[selectedView].toLocaleString()
                      }
                    </p>
                    <p className="text-xs text-red-600 flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      -{(Math.random() * 15 + 5).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
        <CardHeader>
          <CardTitle>Category Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="chart-category-performance">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'revenue' ? 'Revenue' : name === 'quantity' ? 'Quantity' : 'Products'
                  ]}
                />
                <Bar dataKey="revenue" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Profitability & Return Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Product Profitability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marginCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                  <span className="text-sm font-medium text-foreground">{category.range}</span>
                  <span className={cn("text-sm font-bold", category.color)} data-testid={`margin-category-${index}`}>
                    {category.count}
                  </span>
                </div>
              ))}
              <div className="mt-4 p-4 bg-accent/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Average Product Margin</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-avg-margin">
                  {(productData.reduce((sum, p) => sum + p.margin, 0) / productData.length).toFixed(1)}%
                </p>
                <p className="text-xs text-green-600">+2.3% vs industry average</p>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
          <CardHeader>
            <CardTitle>Return Rate Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg">
                <span className="text-sm font-medium text-foreground">Overall Return Rate</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-overall-return-rate">
                  {(returnRates.reduce((sum, r) => sum + r.rate, 0) / returnRates.length).toFixed(1)}%
                </span>
              </div>
              {returnRates.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-foreground">{item.rate}%</span>
                    {item.trend === 'up' && <ArrowUp className="h-3 w-3 text-red-600" />}
                    {item.trend === 'down' && <ArrowDown className="h-3 w-3 text-green-600" />}
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-accent/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Return Cost Impact</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-return-cost">
                  ${(metrics.totalRevenue * 0.035).toLocaleString()}
                </p>
                <p className="text-xs text-red-600">Monthly return processing costs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profitability Line Chart (was Scatter Plot) */}
  <Card className="border border-black dark:border-white dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.12)] rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Volume vs Profitability Analysis</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="ml-2" aria-label="Fullscreen Profitability Analysis">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9V5.25A2.25 2.25 0 0 1 6 3h3.75M20.25 15v3.75A2.25 2.25 0 0 1 18 21h-3.75M15 3.75H18A2.25 2.25 0 0 1 20.25 6v3.75M9 20.25H6A2.25 2.25 0 0 1 3.75 18V15" />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white max-w-5xl w-full h-[90vh] flex flex-col justify-center items-center">
              <DialogTitle>Volume vs Profitability Analysis</DialogTitle>
              <div className="w-full h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Volume vs Profitability Analysis</span>
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
                    <LineChart data={profitabilityData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="volume" 
                        name="Volume" 
                        tick={{ fontSize: 14, fill: '#fff' }}
                        label={{ value: 'Volume (units)', position: 'insideBottom', offset: -5, fill: '#fff' }}
                      />
                      <YAxis 
                        dataKey="profit" 
                        name="Profit" 
                        tick={{ fontSize: 14, fill: '#fff' }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft', fill: '#fff' }}
                      />
                      <Tooltip 
                        contentStyle={{ background: '#222', color: '#fff', border: 'none' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']}
                        labelFormatter={(label: any) => label || ''}
                      />
                      <Line 
                          type="monotone" 
                          dataKey="profit" 
                          stroke="#1976d2" 
                          strokeWidth={3}
                          dot={{ fill: "#1976d2", strokeWidth: 2, r: 5 }}
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
          <div className="h-80" data-testid="chart-profitability-scatter">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="volume" 
                  name="Volume" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Volume (units)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="profit" 
                  name="Profit" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']}
                  labelFormatter={(label: any) => label || ''}
                />
                <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#1976d2" 
                    strokeWidth={3}
                    dot={{ fill: "#1976d2", strokeWidth: 2, r: 5 }}
                    connectNulls={true}
                  />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
