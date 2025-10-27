import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ProcessedData, DashboardMetrics, ChartData } from '../types/analytics';
import { detectColumnMappings } from './column-mapper';

export class DataProcessor {
  static async processFile(file: File): Promise<ProcessedData> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let data: Record<string, any>[] = [];

    try {
      switch (fileExtension) {
        case 'csv':
          data = await this.parseCSV(file);
          break;
        case 'xlsx':
        case 'xls':
          data = await this.parseExcel(file);
          break;
        case 'json':
          data = await this.parseJSON(file);
          break;
        default:
          throw new Error('Unsupported file format');
      }

      if (data.length === 0) {
        throw new Error('File contains no data');
      }

      const columns = Object.keys(data[0]);
      const mappings = detectColumnMappings(columns, data);

      return {
        id: crypto.randomUUID(),
        fileName: file.name,
        fileSize: file.size,
        rowCount: data.length,
        columns,
        data,
        mappings,
        uploadedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static parseCSV(file: File): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          } else {
            resolve(results.data as Record<string, any>[]);
          }
        },
        error: (error) => reject(error)
      });
    });
  }

  private static async parseExcel(file: File): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          resolve(jsonData as Record<string, any>[]);
        } catch (error) {
          reject(new Error(`Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private static async parseJSON(file: File): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          if (Array.isArray(jsonData)) {
            resolve(jsonData);
          } else if (typeof jsonData === 'object' && jsonData.data && Array.isArray(jsonData.data)) {
            resolve(jsonData.data);
          } else {
            reject(new Error('JSON file must contain an array of objects or an object with a "data" array property'));
          }
        } catch (error) {
          reject(new Error(`JSON parsing error: ${error instanceof Error ? error.message : 'Invalid JSON format'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read JSON file'));
      reader.readAsText(file);
    });
  }

  static calculateMetrics(processedData: ProcessedData): DashboardMetrics {
    const { data, mappings } = processedData;

    // Helpers
    const findMapping = (fields: string[]) => mappings.find((m: any) => fields.includes(m.businessField) && m.mapped);

    const toNumber = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const cleaned = value.replace(/[$,\s%]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
      }
      return Number(value) || 0;
    };

    const parseDate = (value: any): Date | null => {
      if (!value) return null;
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    };

    const groupBy = (key: string, fn: (row: Record<string, any>) => string | null) => {
      const out: Record<string, number> = {};
      data.forEach(row => {
        const k = fn(row);
        if (!k) return;
        const val = toNumber(row[key] ?? row);
        out[k] = (out[k] || 0) + val;
      });
      return out;
    };

    const dateMapping = findMapping(['Transaction Date', 'Order Date']);
    const revenueMapping = findMapping(['Revenue', 'Total Amount', 'Amount']);
    const profitMapping = findMapping(['Profit', 'Net Profit']);
    const costMapping = findMapping(['Cost', 'Cost of Goods Sold', 'COGS']);
    const transactionMapping = findMapping(['Transaction ID', 'Order ID', 'Invoice ID']);
    const quantityMapping = findMapping(['Quantity', 'Qty']);
    const unitPriceMapping = findMapping(['Unit Price', 'Price', 'Item Price']);
    const inventoryMapping = findMapping(['Inventory Quantity', 'Stock', 'Quantity on Hand']);
    const productIdMapping = findMapping(['Product ID', 'SKU']);
    const productNameMapping = findMapping(['Product Name', 'Item Name']);
    const customerMapping = findMapping(['Customer ID', 'Customer Email', 'Email']);

    // Revenue and profit
    const revenueValues: number[] = revenueMapping
      ? data.map(row => toNumber(row[revenueMapping.sourceColumn])).filter(v => v > 0)
      : [];

    // Compute profit robustly: use Profit if present, else Revenue - Cost if cost present, else 0
    let totalProfit = 0;
    if (profitMapping) {
      totalProfit = data.map(row => toNumber(row[profitMapping.sourceColumn])).reduce((s, v) => s + v, 0);
    } else if (costMapping && revenueMapping) {
      totalProfit = data.reduce((s, row) => {
        const r = toNumber(row[revenueMapping.sourceColumn]);
        const c = toNumber(row[costMapping.sourceColumn]);
        return s + (r - c);
      }, 0);
    } else {
      totalProfit = 0;
    }

    const totalRevenue = revenueValues.reduce((s, v) => s + v, 0);

    // Transactions: prefer transaction ID grouping
    let totalTransactions = 0;
    if (transactionMapping) {
      const txSet = new Set<string>();
      data.forEach(row => {
        const tx = String(row[transactionMapping.sourceColumn] ?? '').trim();
        if (tx) txSet.add(tx);
      });
      totalTransactions = txSet.size;
    } else {
      totalTransactions = data.length;
    }

    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Inventory metrics
    let inventoryValues: number[] = [];
    if (inventoryMapping) {
      inventoryValues = data.map(row => toNumber(row[inventoryMapping.sourceColumn]));
    }
    const activeProducts = (() => {
      if (productIdMapping) return new Set(data.map(r => String(r[productIdMapping.sourceColumn] ?? '')).filter(Boolean)).size;
      if (productNameMapping) return new Set(data.map(r => String(r[productNameMapping.sourceColumn] ?? '')).filter(Boolean)).size;
      return 0;
    })();
    const lowStock = inventoryValues.filter(q => q > 0 && q <= 10).length;
    const outOfStock = inventoryValues.filter(q => q === 0).length;
    let totalInventoryValue = 0;
    if (inventoryMapping && unitPriceMapping) {
      totalInventoryValue = data.reduce((s, row) => s + (toNumber(row[inventoryMapping.sourceColumn]) * toNumber(row[unitPriceMapping.sourceColumn])), 0);
    } else {
      totalInventoryValue = 0; // unknown without unit price
    }

    // Customer metrics
    const customers = new Map<string, Date[]>();
    if (customerMapping) {
      data.forEach(row => {
        const cust = String(row[customerMapping.sourceColumn] ?? '').trim();
        if (!cust) return;
        const dt = dateMapping ? parseDate(row[dateMapping.sourceColumn]) : null;
        if (!customers.has(cust)) customers.set(cust, []);
        if (dt) customers.get(cust)!.push(dt);
      });
    }
    const totalCustomers = customers.size;
    // New customers: customers whose first purchase is within last 30 days
    let newCustomers = 0;
    if (dateMapping && totalCustomers > 0) {
      const allDates = data.map(r => parseDate(r[dateMapping.sourceColumn])).filter(Boolean) as Date[];
      const maxDate = allDates.length ? new Date(Math.max(...allDates.map(d => d.getTime()))) : null;
      if (maxDate) {
        const cutoff = new Date(maxDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        customers.forEach(dates => {
          const first = dates.sort((a,b) => a.getTime() - b.getTime())[0];
          if (first && first.getTime() >= cutoff.getTime()) newCustomers++;
        });
      }
    }
    // Retention: percent of customers with >1 purchase
    const repeatCustomers = Array.from(customers.values()).filter(dates => dates.length > 1).length;
    const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
    const avgLTV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Growth rates: compute percent change between last and previous interval
    const toPeriodKey = {
      daily: (d: Date) => d.toISOString().split('T')[0],
      weekly: (d: Date) => {
        const tmp = new Date(d.valueOf());
        const year = tmp.getUTCFullYear();
        const start = new Date(Date.UTC(year,0,1));
        const days = Math.floor((tmp.getTime() - start.getTime()) / (24*60*60*1000));
        const week = Math.ceil((days + start.getUTCDay()+1)/7);
        return `${year}-W${String(week).padStart(2,'0')}`;
      },
      monthly: (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`,
      quarterly: (d: Date) => `${d.getUTCFullYear()}-Q${Math.floor(d.getUTCMonth()/3)+1}`,
      yearly: (d: Date) => `${d.getUTCFullYear()}`
    } as const;

    const computeGrowth = (period: keyof typeof toPeriodKey) => {
      if (!dateMapping || !revenueMapping) return 0;
      const grouped: Record<string, number> = {};
      data.forEach(row => {
        const d = parseDate(row[dateMapping.sourceColumn]);
        if (!d) return;
        const k = toPeriodKey[period](d as Date);
        const rev = toNumber(row[revenueMapping.sourceColumn]);
        grouped[k] = (grouped[k] || 0) + rev;
      });
      const keys = Object.keys(grouped).sort();
      if (keys.length < 2) return 0;
      const last = grouped[keys[keys.length-1]];
      const prev = grouped[keys[keys.length-2]];
      if (prev === 0) return last === 0 ? 0 : 100;
      return ((last - prev) / Math.abs(prev)) * 100;
    };

    const dailyGrowth = computeGrowth('daily');
    const weeklyGrowth = computeGrowth('weekly');
    const monthlyGrowth = computeGrowth('monthly');
    const quarterlyGrowth = computeGrowth('quarterly');
    const yearlyGrowth = computeGrowth('yearly');

    return {
      totalRevenue,
      totalProfit,
      totalTransactions,
      avgOrderValue,
      profitMargin,
      inventoryMetrics: {
        activeProducts,
        lowStock,
        outOfStock,
        totalValue: totalInventoryValue
      },
      customerMetrics: {
        total: totalCustomers,
        new: newCustomers,
        retention: retentionRate,
        ltv: avgLTV
      },
      growthRates: {
        daily: dailyGrowth,
        weekly: weeklyGrowth,
        monthly: monthlyGrowth,
        quarterly: quarterlyGrowth,
        yearly: yearlyGrowth
      }
    };
  }

  static generateChartData(processedData: ProcessedData, chartType: string): ChartData[] {
    const { data, mappings } = processedData;
    
    // Get mapped field values
    const getMappedValues = (businessFieldName: string): any[] => {
      const mapping = mappings.find(m => m.businessField === businessFieldName && m.mapped);
      if (!mapping) return [];
      return data.map(row => row[mapping.sourceColumn]).filter(v => v !== null && v !== undefined && v !== '');
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

    switch (chartType) {
      case 'revenue-trends':
        return this.generateRevenueTrends(data, mappings);
      case 'category-performance':
        return this.generateCategoryPerformance(data, mappings);
      case 'customer-segments':
        return this.generateCustomerSegments(data, mappings);
      default:
        return [];
    }
  }

  private static generateRevenueTrends(data: Record<string, any>[], mappings: any[]): ChartData[] {
    const dateMapping = mappings.find(m => 
      (m.businessField === 'Transaction Date' || m.businessField === 'Order Date') && m.mapped
    );
    const revenueMapping = mappings.find(m => 
      (m.businessField === 'Revenue' || m.businessField === 'Total Amount' || m.businessField === 'Amount') && m.mapped
    );

    if (!dateMapping || !revenueMapping) return [];

    const groupedData: Record<string, number> = {};

    data.forEach(row => {
      const d = new Date(row[dateMapping.sourceColumn]);
      if (isNaN(d.getTime())) return;
      const revenue = parseFloat(String(row[revenueMapping.sourceColumn]).replace(/[$,\s]/g, '')) || 0;
      if (revenue <= 0) return;
      const dateKey = d.toISOString().split('T')[0];
      groupedData[dateKey] = (groupedData[dateKey] || 0) + revenue;
    });

    return Object.entries(groupedData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue, name: date }));
  }

  private static generateCategoryPerformance(data: Record<string, any>[], mappings: any[]): ChartData[] {
    const categoryMapping = mappings.find(m => 
      (m.businessField === 'Product Category' || m.businessField === 'Product Subcategory') && m.mapped
    );
    const revenueMapping = mappings.find(m => 
      (m.businessField === 'Revenue' || m.businessField === 'Total Amount') && m.mapped
    );

    if (!categoryMapping || !revenueMapping) return [];

    const groupedData: Record<string, number> = {};
    
    data.forEach(row => {
      const category = String(row[categoryMapping.sourceColumn] ?? 'Other') || 'Other';
      const revenue = parseFloat(String(row[revenueMapping.sourceColumn]).replace(/[$,\s]/g, '')) || 0;
      if (revenue > 0) groupedData[category] = (groupedData[category] || 0) + revenue;
    });

    return Object.entries(groupedData)
      .sort(([, a], [, b]) => b - a)
      .map(([category, revenue]) => ({
        name: category,
        value: revenue,
        revenue
      }));
  }

  private static generateCustomerSegments(data: Record<string, any>[], mappings: any[]): ChartData[] {
    const customerMapping = mappings.find(m => 
      (m.businessField === 'Customer ID' || m.businessField === 'Customer Email') && m.mapped
    );
    const revenueMapping = mappings.find(m => 
      (m.businessField === 'Revenue' || m.businessField === 'Total Amount') && m.mapped
    );

    if (!customerMapping || !revenueMapping) return [];

    // Calculate customer lifetime values
    const customerRevenues: Record<string, number> = {};
    
    data.forEach(row => {
      const customer = String(row[customerMapping.sourceColumn] || '');
      const revenue = parseFloat(String(row[revenueMapping.sourceColumn]).replace(/[$,\s]/g, '')) || 0;
      
      if (customer && revenue > 0) {
        customerRevenues[customer] = (customerRevenues[customer] || 0) + revenue;
      }
    });

    // Segment customers by value
    const segments = {
      'VIP ($5000+)': 0,
      'High Value ($1000-$5000)': 0,
      'Regular ($100-$1000)': 0,
      'New (<$100)': 0
    };

    Object.values(customerRevenues).forEach(revenue => {
      if (revenue >= 5000) segments['VIP ($5000+)']++;
      else if (revenue >= 1000) segments['High Value ($1000-$5000)']++;
      else if (revenue >= 100) segments['Regular ($100-$1000)']++;
      else segments['New (<$100)']++;
    });

    return Object.entries(segments).map(([name, value]) => ({
      name,
      value,
      customers: value
    }));
  }
}
