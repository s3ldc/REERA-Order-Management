import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { cn } from "../../lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
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
    <Card
      className={cn(
        "rounded-[24px] border border-border bg-card shadow-sm overflow-hidden transition-colors",
        className,
      )}
    >
      <CardHeader className="px-6 pt-6 pb-0 flex flex-col gap-1">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
          {title}
        </CardTitle>

        {subtitle && (
          <p className="text-xs font-medium text-muted-foreground/80">
            {subtitle}
          </p>
        )}
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2">{children}</CardContent>
    </Card>
  );
}
