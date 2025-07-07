"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
