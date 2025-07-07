import type { Metadata } from "next";
import "./globals.css";
import ThemeWrapper from "@/components/layout/theme-wrapper"; // ✅ Import wrapper

export const metadata: Metadata = {
  title: "Aman Shaikh - Personal Portfolio",
  description:
    "Aman Shaikh - Software Engineer specializing in Backend Development, System Design, and Cloud Computing",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
