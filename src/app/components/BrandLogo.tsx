"use client";

import React from "react";

export function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center select-none flex-shrink-0 group">
      {/* Card 1: Left Deep Teal Fan Card (-18 deg) */}
      <div className="absolute w-[23px] h-[34px] rounded-[8px] bg-[#257180] border-[1.5px] border-[#FAF3E0] -rotate-[18deg] -translate-x-2.5 translate-y-0.5 shadow-md transition-transform duration-300 group-hover:-rotate-[24deg] group-hover:-translate-x-3.5 flex flex-col justify-between p-0.5">
        <span className="text-[7px] font-black text-[#FAF3E0]/70 leading-none">♠</span>
        <span className="text-[7px] font-black text-[#FAF3E0]/70 leading-none self-end">♠</span>
      </div>

      {/* Card 2: Right Terracotta Rust Fan Card (+18 deg) */}
      <div className="absolute w-[23px] h-[34px] rounded-[8px] bg-[#CB6040] border-[1.5px] border-[#FAF3E0] rotate-[18deg] translate-x-2.5 translate-y-0.5 shadow-md transition-transform duration-300 group-hover:rotate-[24deg] group-hover:translate-x-3.5 flex flex-col justify-between p-0.5">
        <span className="text-[7px] font-black text-[#FAF3E0]/70 leading-none">♥</span>
        <span className="text-[7px] font-black text-[#FAF3E0]/70 leading-none self-end">♥</span>
      </div>

      {/* Card 3: Center Sunset Orange Spotlight Card (Front Center) */}
      <div className="absolute z-10 w-[26px] h-[37px] rounded-[9px] bg-gradient-to-br from-[#FD8B51] via-[#FD8B51] to-[#CB6040] border-[2px] border-[#FAF3E0] shadow-xl flex flex-col items-center justify-between p-1 transition-transform duration-300 group-hover:scale-110">
        <div className="w-full flex justify-between text-[6px] font-black text-white/70 leading-none">
          <span>♥</span>
          <span>♦</span>
        </div>
        <span className="text-[11px] font-black text-white drop-shadow-sm tracking-tighter my-auto">OS</span>
        <div className="w-full flex justify-between text-[6px] font-black text-white/70 leading-none">
          <span>♦</span>
          <span>♣</span>
        </div>
      </div>
    </div>
  );
}
