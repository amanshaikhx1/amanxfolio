"use client";

import { memo } from "react";
import dynamic from "next/dynamic";

const DynamicPreloader = dynamic(() => import("./preloader"), { ssr: false });

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <>
      <DynamicPreloader />
      {children}
    </>
  );
};

export default memo(ClientLayout);
