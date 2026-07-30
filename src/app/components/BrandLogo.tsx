"use client";

import React from "react";

export function BrandLogo() {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center select-none flex-shrink-0 group">
      {/* Card 1: Left Deep Teal Fan Card (-14 deg) */}
      <div className="absolute w-[24px] h-[35px] rounded-[7px] bg-[#257180] border-[1.5px] border-[#FAF3E0] -rotate-[14deg] -translate-x-2.5 translate-y-0.5 shadow-md transition-transform duration-300 group-hover:-rotate-[20deg] group-hover:-translate-x-3.5 flex flex-col justify-between p-0.5">
        <div className="w-full flex justify-between text-[4.5px] font-bold text-[#FAF3E0]/50 leading-none px-0.5">
          <span>♥</span><span>♠</span>
        </div>
        <div className="w-full flex justify-between text-[4.5px] font-bold text-[#FAF3E0]/50 leading-none px-0.5">
          <span>♦</span><span>♣</span>
        </div>
      </div>

      {/* Card 2: Right Terracotta Rust Fan Card (+14 deg) */}
      <div className="absolute w-[24px] h-[35px] rounded-[7px] bg-[#CB6040] border-[1.5px] border-[#FAF3E0] rotate-[14deg] translate-x-2.5 translate-y-0.5 shadow-md transition-transform duration-300 group-hover:rotate-[20deg] group-hover:translate-x-3.5 flex flex-col justify-between p-0.5">
        <div className="w-full flex justify-between text-[4.5px] font-bold text-[#FAF3E0]/50 leading-none px-0.5">
          <span>♥</span><span>♠</span>
        </div>
        <div className="w-full flex justify-between text-[4.5px] font-bold text-[#FAF3E0]/50 leading-none px-0.5">
          <span>♦</span><span>♣</span>
        </div>
      </div>

      {/* Card 3: Center Sunset Orange Spotlight Card with italic serif 'os' */}
      <div className="absolute z-10 w-[27px] h-[38px] rounded-[8px] bg-gradient-to-br from-[#FD8B51] via-[#FD8B51] to-[#CB6040] border-[2px] border-[#FAF3E0] shadow-xl flex flex-col items-center justify-between p-0.5 transition-transform duration-300 group-hover:scale-105">
        <div className="w-full flex justify-between text-[5px] font-bold text-white/50 leading-none px-0.5">
          <span>♥</span><span>♠</span>
        </div>
        <span className="text-[12px] font-black italic text-white drop-shadow-sm tracking-normal my-auto font-serif">
          os
        </span>
        <div className="w-full flex justify-between text-[5px] font-bold text-white/50 leading-none px-0.5">
          <span>♦</span><span>♣</span>
        </div>
      </div>
    </div>
  );
}
