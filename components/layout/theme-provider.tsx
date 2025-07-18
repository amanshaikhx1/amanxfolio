// components/theme-provider.tsx
"use client"

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default ThemeProvider // ✅ default export
