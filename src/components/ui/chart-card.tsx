import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { cn } from "../../lib/utils"; // Assuming you have the standard shadcn utility

interface ChartCardProps {
  title: string;
  subtitle?: string; // Added for more context
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("rounded-[24px] border border-slate-100 shadow-sm bg-white overflow-hidden", className)}>
      <CardHeader className="px-6 pt-6 pb-0 flex flex-col gap-1">
        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        )}
      </CardHeader>
      
      {/* Increased padding for chart "breathing room" */}
      <CardContent className="px-6 pb-6 pt-2">
        {children}
      </CardContent>
    </Card>
  );
}