"use client";

import React from "react";

export function BrandLogo() {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center select-none flex-shrink-0 group">
      {/* Card 1: Left Deep Teal Fan Card (-14 deg) */}
      <div className="absolute w-[24px] h-[35px] rounded-[7px] bg-[#257180] border-[1.5px] border-[#FAF3E0] -rotate-[14deg] -translate-x-2.5 translate-y-0.5 shadow-md transition-transform duration-300 group-hover:-rotate-[20deg] group-hover:-translate-x-3.5" />

      {/* Card 2: Right Terracotta Rust Fan Card (+14 deg) */}
      <div className="absolute w-[24px] h-[35px] rounded-[7px] bg-[#CB6040] border-[1.5px] border-[#FAF3E0] rotate-[14deg] translate-x-2.5 translate-y-0.5 shadow-md transition-transform duration-300 group-hover:rotate-[20deg] group-hover:translate-x-3.5" />

      {/* Card 3: Center Sunset Orange Spotlight Card with italic serif 'os' */}
      <div className="absolute z-10 w-[27px] h-[38px] rounded-[8px] bg-gradient-to-br from-[#FD8B51] via-[#FD8B51] to-[#CB6040] border-[2px] border-[#FAF3E0] shadow-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <span className="text-[13px] font-black italic text-white drop-shadow-sm tracking-normal font-serif select-none">
          os
        </span>
      </div>
    </div>
  );
}
