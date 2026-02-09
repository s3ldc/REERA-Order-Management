import React from "react";
import { X, User, Truck, CheckCircle2, Package } from "lucide-react";
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

const DistributorOrderTimelineDrawer: React.FC<Props> = ({ order, onClose }) => {
  const { events, loading } = useOrderTimeline(order.id);

  // Distributor-visible events only
  const visibleEvents = events.filter(
    (e) => e.type === "assigned" || e.type === "status_updated"
  );

  const getIcon = (type: string) => {
    if (type === "assigned") return Package;
    if (type === "status_updated") return CheckCircle2;
    return Truck;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[420px] bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <Card className="h-full rounded-none border-none flex flex-col">
          
          {/* Header */}
          <CardHeader className="px-6 py-5 border-b bg-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Order Activity
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {order.spa_name} • {order.product_name}
                </p>
              </div>
              <Button size="icon" variant="ghost" onClick={onClose}>
                <X className="w-5 h-5 text-slate-500" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="flex-1 px-6 py-6 overflow-y-auto">
            {loading ? (
              <p className="text-center text-sm text-slate-400">
                Loading timeline…
              </p>
            ) : visibleEvents.length === 0 ? (
              <p className="text-center text-sm text-slate-400">
                No distributor activity yet
              </p>
            ) : (
              <ol className="relative border-l border-slate-200 space-y-8">
                {visibleEvents.map((event) => {
                  const Icon = getIcon(event.type);
                  return (
                    <li key={event.id} className="ml-6">
                      <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full">
                        <Icon className="w-3 h-3 text-indigo-600" />
                      </span>

                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-700 uppercase">
                          {event.type.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-400">
                          {dayjs(event.created).fromNow()}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-700">
                        {event.message}
                      </p>

                      {event.expand?.actor_id && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <User className="w-3 h-3" />
                          {event.expand.actor_id.name ||
                            event.expand.actor_id.email}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DistributorOrderTimelineDrawer;