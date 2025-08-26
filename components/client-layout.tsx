"use client";

import { memo, ReactNode } from "react";
import dynamic from "next/dynamic";

// Preloader ko sirf client side pe load karne ke liye dynamic import
const DynamicPreloader = dynamic(() => import("./preloader"), {
  ssr: false,
  loading: () => <div>Loading...</div>, // fallback (optional)
});

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <>
      {/* Preloader component */}
      <DynamicPreloader />

      {/* Main children render */}
      <main>{children}</main>
    </>
  );
};

export default memo(ClientLayout);
