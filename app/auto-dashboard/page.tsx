"use client";
import { useState } from "react";
import { useAnalyticsStore } from "./store/analytics-store";
import type { DashboardSection } from "./types/analytics";
import FileUpload from "./components/file-upload";
import ColumnMapping from "./components/column-mapping";
import DashboardNavigation from "./components/dashboard/navigation";
import SummaryMetrics from "./components/dashboard/summary-metrics";
import TrendsAnalysis from "./components/dashboard/trends-analysis";
import ProductAnalysis from "./components/dashboard/product-analysis";
import CustomerAnalysis from "./components/dashboard/customer-analysis";
import FinancialAnalysis from "./components/dashboard/financial-analysis";
import OperationalAnalysis from "./components/dashboard/operational-analysis";
import MarketingAnalysis from "./components/dashboard/marketing-analysis";
import { Button } from "./components/ui/button";
import { ChartBar, Upload } from "lucide-react";

export default function Dashboard() {
  const { currentSection, processedData, error } = useAnalyticsStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getSectionTitle = () => {
    const titles: Record<DashboardSection, string> = {
      upload: 'Data Upload',
      mapping: 'Column Mapping',
      summary: 'Summary Metrics',
      trends: 'Trends & Time Analysis',
      products: 'Product Analysis',
      customers: 'Customer Analysis',
      financial: 'Financial Analysis',
      operational: 'Operational Analysis',
      marketing: 'Marketing & Promotion'
    };
    return titles[currentSection as DashboardSection] || 'Analytics Platform';
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'upload':
        return <FileUpload />;
      case 'mapping':
        return <ColumnMapping />;
      case 'summary':
        return <SummaryMetrics />;
      case 'trends':
        return <TrendsAnalysis />;
      case 'products':
        return <ProductAnalysis />;
      case 'customers':
        return <CustomerAnalysis />;
      case 'financial':
        return <FinancialAnalysis />;
      case 'operational':
        return <OperationalAnalysis />;
      case 'marketing':
        return <MarketingAnalysis />;
      default:
        return <FileUpload />;
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar Navigation (Desktop) */}
        <div className="hidden md:block w-64 min-h-screen border-r bg-background">
          <DashboardNavigation 
            isMobileMenuOpen={false}
            setIsMobileMenuOpen={() => {}}
          />
        </div>

        {/* Floating Menu Button (Always Visible, Left Side) */}
        <button
          className="fixed left-4 top-[15%] z-30 bg-primary text-white rounded-full p-4 shadow-lg flex items-center justify-center md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          type="button"
          style={{ width: '56px', height: '56px' }}
        >
          <ChartBar className="h-7 w-7" />
        </button>

        {/* Overlay Vertical Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-start md:hidden">
            <div className="w-64 bg-white h-auto max-h-[90vh] shadow-xl rounded-r-xl p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Menu</span>
                <button
                  className="p-2 rounded hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  type="button"
                >
                  ✕
                </button>
              </div>
              <DashboardNavigation 
                isMobileMenuOpen={true}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content (no shift for mobile) */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">{getSectionTitle()}</h2>
              {currentSection !== 'upload' && currentSection !== 'mapping' && (
                <p className="text-muted-foreground mt-1">
                  Interactive analytics and insights from your uploaded data
                </p>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-destructive rounded-full mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-destructive font-medium">Error</p>
                      <p className="text-destructive/80 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {renderCurrentSection()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
