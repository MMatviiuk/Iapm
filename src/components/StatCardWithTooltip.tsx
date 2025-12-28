import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface StatCardWithTooltipProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
  tooltipTitle: string;
  tooltipDescription: string;
  darkMode: boolean;
  bgColor: string;
  borderColor: string;
}

export default function StatCardWithTooltip({
  icon: Icon,
  iconColor,
  label,
  value,
  tooltipTitle,
  tooltipDescription,
  darkMode,
  bgColor,
  borderColor
}: StatCardWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card className={`p-3 sm:p-4 border-2 cursor-help ${
          darkMode ? bgColor : bgColor
        } ${
          darkMode ? borderColor : borderColor
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2.5} />
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {label}
            </p>
          </div>
          <p className={`text-2xl sm:text-3xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </p>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs p-3">
        <p className="font-bold mb-1">{tooltipTitle}</p>
        <p className="text-sm">{tooltipDescription}</p>
      </TooltipContent>
    </Tooltip>
  );
}
