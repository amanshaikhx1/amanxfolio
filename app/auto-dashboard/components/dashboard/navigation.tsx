import React from "react";
import { useAnalyticsStore } from "../../store/analytics-store";
import { cn } from "../../lib/utils";
import { Upload, ListChecks, BarChart, LineChart, Package, Users, DollarSign, Clock, Megaphone } from "lucide-react";

const NAV_ITEMS = [
  { key: "upload", label: "Upload Data", icon: Upload },
  { key: "mapping", label: "Column Mapping", icon: ListChecks },
  { key: "summary", label: "Summary Metrics", icon: BarChart },
  { key: "trends", label: "Trends & Time", icon: LineChart },
  { key: "products", label: "Product Analysis", icon: Package },
  { key: "customers", label: "Customer Analysis", icon: Users },
  { key: "financial", label: "Financial Analysis", icon: DollarSign },
  { key: "operational", label: "Operational Analysis", icon: Clock },
  { key: "marketing", label: "Marketing & Promotion", icon: Megaphone },
];

export default function DashboardNavigation({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}) {
  const { currentSection, setCurrentSection } = useAnalyticsStore();

  const handleNavClick = (key: string) => {
    setCurrentSection(key as any);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
  <nav className="mb-8 bg-background text-foreground relative">
    {/* Cancel/Close button for mobile menu */}
    {isMobileMenuOpen && (
      <button
        className="absolute top-4 right-4 z-50 p-2 rounded-full text-xl text-black dark:text-white bg-muted hover:bg-accent transition-colors"
        aria-label="Close menu"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        &#10005;
      </button>
    )}
    <ul className="flex flex-col gap-2 bg-background text-foreground dark:bg-background dark:text-foreground">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.key} className="bg-background text-foreground dark:bg-background dark:text-foreground">
              <button
                className={cn(
                  "w-full text-left px-4 py-2 rounded transition-colors flex items-center gap-3 bg-background text-foreground dark:bg-background dark:text-foreground",
                  currentSection === item.key
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-accent/40 text-foreground dark:hover:bg-accent/40 dark:text-foreground"
                )}
                onClick={() => handleNavClick(item.key)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
