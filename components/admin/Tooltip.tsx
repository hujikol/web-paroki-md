"use client";

import { ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-700",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-700",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-700",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-700",
  };

  return (
    <div className="group/tooltip relative inline-flex items-center justify-center">
      {children}
      
      {/* Tooltip Panel */}
      <div 
        className={`absolute z-[1000] ${positionClasses[position]} invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none`}
      >
        <div className="relative bg-slate-700 text-white text-xs font-medium px-2 py-1 rounded-md shadow-md whitespace-nowrap">
          {content}
          
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
        </div>
      </div>
    </div>
  );
}
