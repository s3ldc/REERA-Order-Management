import React from "react";
import { X, User, Box, Truck, CheckCircle2, CreditCard, PackageCheck, Loader2 } from "lucide-react";
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

const OrderTimelineDrawer: React.FC<Props> = ({ order, onClose }) => {
  const { events, loading } = useOrderTimeline(order.id);

  const getEventConfig = (type: string, message: string) => {
    const lowerType = type.toLowerCase();
    const lowerMsg = message.toLowerCase();

    if (lowerType === "created" || lowerMsg.includes("created")) {
      return { icon: Box, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    }
    if (lowerType === "dispatched" || lowerMsg.includes("dispatched") || lowerMsg.includes("shipped")) {
      return { icon: Truck, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    }
    if (lowerType === "status_change" || lowerMsg.includes("processing") || lowerMsg.includes("status changed")) {
      return { icon: PackageCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    }
    if (lowerType === "payment" || lowerMsg.includes("paid") || lowerMsg.includes("unpaid")) {
      return { icon: CreditCard, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" };
    }
    if (lowerType === "delivered" || lowerMsg.includes("delivered")) {
      return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    }
    return { icon: Box, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" };
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <Card className="h-full rounded-none border-none flex flex-col shadow-none overflow-hidden">
          
          <CardHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Internal Audit</h3>
                <h2 className="text-lg font-bold text-slate-900">Order Timeline</h2>
              </div>
              <Button size="icon" variant="ghost" onClick={onClose} className="rounded-xl hover:bg-white border border-transparent hover:border-slate-200 shadow-sm transition-all">
                <X className="w-5 h-5 text-slate-500" />
              </Button>
            </div>
          </CardHeader>

          {/* Added better padding and overflow handling */}
          <CardContent className="flex-1 px-10 py-10 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing History</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs font-medium uppercase tracking-tight">
                No activity records found
              </div>
            ) : (
              <div className="relative">
                {/* Visual Connector Line - Optimized position */}
                <div className="absolute left-[20px] top-2 bottom-2 w-[2px] bg-slate-100" />

                <div className="space-y-12">
                  {events.map((event) => {
                    const config = getEventConfig(event.type, event.message);
                    return (
                      <div key={event.id} className="relative pl-14 group">
                        {/* Dynamic Status Node - Larger, better centered */}
                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm z-10 transition-all group-hover:scale-110 group-hover:shadow-md ${config.bg} ${config.border}`}>
                          <config.icon className={`w-4 h-4 ${config.color}`} />
                        </div>

                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                               {event.type.replace("_", " ")}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                               {dayjs(event.created).fromNow()}
                            </span>
                          </div>
                          
                          <p className="text-sm font-bold text-slate-800 leading-snug">
                            {event.message}
                          </p>

                          {event.expand?.actor_id && (
                            <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 bg-slate-50 rounded-lg w-fit border border-slate-100/50">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                {event.expand.actor_id.name || event.expand.actor_id.email}
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

          <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">End of Audit Trail</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderTimelineDrawer;