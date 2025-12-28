import { HelpCircle } from 'lucide-react';
import { Label } from './ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { ReactNode } from 'react';

interface FieldWithTooltipProps {
  label: string;
  tooltip: string;
  required?: boolean;
  htmlFor?: string;
  darkMode?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * FieldWithTooltip Component
 * 
 * Renders a label with an inline help icon that shows a tooltip on hover/tap.
 * Designed for elderly users - provides helpful explanations for complex fields.
 * 
 * @param label - The text to display in the label
 * @param tooltip - HTML content for the tooltip (supports bold, line breaks, bullets)
 * @param required - Whether to show a red asterisk (*)
 * @param htmlFor - ID of the associated input element
 * @param darkMode - Whether dark mode is enabled
 * @param className - Additional CSS classes for the label
 * @param children - The input field or other content to render below the label
 * 
 * @example
 * <FieldWithTooltip
 *   label="Medication Name"
 *   tooltip="<strong>Enter the full name</strong> of your medication.<br/><br/>Examples:<br/>• Lisinopril<br/>• Aspirin"
 *   required={true}
 *   htmlFor="name"
 *   darkMode={darkMode}
 * >
 *   <input type="text" id="name" />
 * </FieldWithTooltip>
 */
export function FieldWithTooltip({
  label,
  tooltip,
  required = false,
  htmlFor,
  darkMode = false,
  className = '',
  children
}: FieldWithTooltipProps) {
  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 ${className}`}>
        <Label htmlFor={htmlFor} className="text-base sm:text-lg">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              type="button"
              className={`p-0 m-0 border-0 outline-none bg-transparent shadow-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors ${
                darkMode 
                  ? 'text-slate-500 hover:text-slate-300 focus:text-slate-300' 
                  : 'text-slate-400 hover:text-slate-600 focus:text-slate-600'
              }`}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
              aria-label={`Help for ${label}`}
            >
              <HelpCircle 
                className="w-4 h-4 sm:w-5 sm:h-5 cursor-help"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="max-w-xs text-sm"
            sideOffset={5}
          >
            <div dangerouslySetInnerHTML={{ __html: tooltip }} />
          </TooltipContent>
        </Tooltip>
      </div>
      {children}
    </div>
  );
}