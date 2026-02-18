import React from "react";
import {
  X,
  User,
  Box,
  Truck,
  CheckCircle2,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import type { Doc } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Props {
  order: Doc<"orders">;
  onClose: () => void;
}

const SalespersonOrderTimelineDrawer: React.FC<Props> = ({
  order,
  onClose,
}) => {
  const events = useQuery(api.orderEvents.getByOrderId, {
  orderId: order._id,
});

const loading = events === undefined;

  const getEventConfig = (type: string, message: string) => {
    const t = type.toLowerCase();
    const m = message.toLowerCase();

    if (t === "created" || m.includes("created")) {
      return {
        icon: Box,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900",
        border: "border-blue-200 dark:border-blue-700",
      };
    }

    if (t === "assigned" || m.includes("assigned")) {
      return {
        icon: User,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-900",
        border: "border-indigo-200 dark:border-indigo-700",
      };
    }

    if (m.includes("dispatched") || m.includes("shipped")) {
      return {
        icon: Truck,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-900",
        border: "border-amber-200 dark:border-amber-700",
      };
    }

    if (m.includes("delivered")) {
      return {
        icon: CheckCircle2,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900",
        border: "border-emerald-200 dark:border-emerald-700",
      };
    }

    if (t === "payment_updated" || m.includes("paid")) {
      return {
        icon: CreditCard,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-100 dark:bg-violet-900",
        border: "border-violet-200 dark:border-violet-700",
      };
    }

    return {
      icon: Box,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[450px] bg-card text-foreground h-full shadow-2xl flex flex-col border-l border-border">
        <Card className="h-full rounded-none border-none flex flex-col shadow-none overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                  Sales Audit
                </h3>
                <h2 className="text-lg font-bold text-foreground">
                  Order Timeline
                </h2>
              </div>
              <Button size="icon" variant="ghost" onClick={onClose}>
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 px-10 py-10 overflow-y-auto relative bg-card">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">
                  Syncing Pipeline...
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-10 h-10 text-slate-200 mb-4" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  No activity logged yet
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[20px] top-2 bottom-2 w-[2px] bg-border dark:bg-border/80" />

                <div className="space-y-12">
                  {events.map((event) => {
                    const config = getEventConfig(event.type, event.message);

                    return (
                      <div key={event._id} className="relative pl-16 group">
                        <div
                          className={`absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm z-10 transition-all group-hover:scale-110 ${config.bg} ${config.border}`}
                        >
                          <config.icon className={`w-4 h-4 ${config.color}`} />
                        </div>

                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}
                            >
                              {event.type.replace("_", " ")}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                              {dayjs(event._creationTime).fromNow()}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-foreground leading-snug">
                            {event.message}
                          </p>

                          {event.actor && (
                            <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 bg-muted rounded-lg w-fit border border-border">
                              <User className="w-3 h-3 text-muted-foreground" />
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                {event.actor.name || event.actor.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>

          <div className="px-8 py-6 border-t border-border bg-card text-center">
            <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
              End of Operational Log
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SalespersonOrderTimelineDrawer;
