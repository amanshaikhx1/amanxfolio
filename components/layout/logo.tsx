// components/Logo.tsx
import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 120"
      className={className}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="50" fill="#0ea5e9" />

      {/* Centered A */}
      <text
        x="60"
        y="70"
        textAnchor="middle"
        fontSize="48"
        fontWeight="bold"
        fill="white"
      >
        A
      </text>

      {/* Dots */}
      <circle cx="30" cy="90" r="5" fill="white" />
      <circle cx="90" cy="30" r="5" fill="white" />

      {/* Amanx part */}
      <text
        x="130"
        y="65"
        fontSize="36"
        fontWeight="bold"
        fill="url(#gradient1)"
      >
        Amanx
      </text>

      {/* Folio part */}
      <text
        x="280"
        y="65"
        fontSize="36"
        fontWeight="bold"
        fill="url(#gradient2)"
      >
        Folio
      </text>

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0" x2="1" y1="0" y2="0">
          <stop stopColor="white" offset="0%" />
          <stop stopColor="#bae6fd" offset="50%" />
          <stop stopColor="#38bdf8" offset="100%" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0" x2="1" y1="0" y2="0">
          <stop stopColor="#a5f3fc" offset="0%" />
          <stop stopColor="#60a5fa" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
