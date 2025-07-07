// components/client-layout.tsx
"use client"

import Preloader from "@/components/preloader"
import GlobalBackground from "@/components/global-background"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <GlobalBackground />
      {children}
    </>
  )
}
