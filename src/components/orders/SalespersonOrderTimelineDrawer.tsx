import React from "react";
import {
  X,
  User,
  Box,
  Truck,
  CheckCircle2,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useOrderTimeline } from "../../hooks/useOrderTimeline";
import type { Order } from "../../context/OrderContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Props {
  order: Order;
  onClose: () => void;
}

const SalespersonOrderTimelineDrawer: React.FC<Props> = ({
  order,
  onClose,
}) => {
  const { events, loading } = useOrderTimeline(order.id);

  const getEventConfig = (type: string, message: string) => {
    const t = type.toLowerCase();
    const m = message.toLowerCase();

    if (t === "created" || m.includes("created")) {
      return {
        icon: Box,
        color: "text-blue-600",
        bg: "bg-blue-50",
      };
    }

    if (t === "assigned" || m.includes("assigned")) {
      return {
        icon: User,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      };
    }

    if (t === "status_updated" && m.includes("dispatched")) {
      return {
        icon: Truck,
        color: "text-amber-600",
        bg: "bg-amber-50",
      };
    }

    if (t === "status_updated" && m.includes("delivered")) {
      return {
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      };
    }

    if (t === "payment_updated") {
      return {
        icon: CreditCard,
        color: "text-violet-600",
        bg: "bg-violet-50",
      };
    }

    return {
      icon: Box,
      color: "text-slate-500",
      bg: "bg-slate-50",
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[420px] bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <Card className="h-full rounded-none border-none flex flex-col shadow-none">
          {/* Header */}
          <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Order Timeline
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {order.spa_name} • {order.product_name}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="flex-1 px-6 py-8 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs text-slate-400 font-medium">
                  Loading timeline…
                </span>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm">
                No activity recorded yet
              </div>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200" />

                <div className="space-y-8">
                  {events.map((event) => {
                    const config = getEventConfig(
                      event.type,
                      event.message,
                    );

                    return (
                      <div key={event.id} className="relative pl-10">
                        {/* Icon */}
                        <div
                          className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}
                        >
                          <config.icon
                            className={`w-4 h-4 ${config.color}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold uppercase ${config.color}`}
                            >
                              {event.type.replace("_", " ")}
                            </span>
                            <span className="text-xs text-slate-400">
                              {dayjs(event.created).fromNow()}
                            </span>
                          </div>

                          <p className="text-sm font-medium text-slate-800">
                            {event.message}
                          </p>

                          {event.expand?.actor_id && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                              <User className="w-3 h-3" />
                              {event.expand.actor_id.name ||
                                event.expand.actor_id.email}
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
        </Card>
      </div>
    </div>
  );
};

export default SalespersonOrderTimelineDrawer;