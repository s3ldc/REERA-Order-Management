import React from "react";
import { X, User, Truck, CheckCircle2, Package, Box, Loader2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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

  // Filter for operational events relevant to the distributor
  const visibleEvents = events.filter(
    (e) => e.type === "assigned" || e.type === "status_updated" || e.type === "created"
  );

  const getEventConfig = (type: string, message: string) => {
    const msg = message.toLowerCase();
    if (type === "created" || msg.includes("created")) 
      return { icon: Box, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (type === "assigned" || msg.includes("assigned")) 
      return { icon: Package, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" };
    if (msg.includes("dispatched") || msg.includes("shipped")) 
      return { icon: Truck, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    if (msg.includes("delivered")) 
      return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    
    return { icon: Truck, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" };
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* SaaS Premium Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        <Card className="h-full rounded-none border-none flex flex-col shadow-none overflow-hidden">
          
          {/* Header */}
          <CardHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Logistics Audit</h3>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Order Activity</h2>
                {/* <div className="mt-2">
                   <Badge variant="outline" className="bg-white border-slate-200 text-[10px] font-bold px-2 py-0">
                      ID: {order.id.slice(0, 8)}
                   </Badge>
                </div> */}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={onClose}
                className="rounded-xl hover:bg-white border border-transparent hover:border-slate-200 shadow-sm transition-all"
              >
                <X className="w-5 h-5 text-slate-500" />
              </Button>
            </div>
          </CardHeader>

          {/* Timeline Content */}
          <CardContent className="flex-1 px-10 py-10 overflow-y-auto relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Syncing Pipeline...</p>
              </div>
            ) : visibleEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-10 h-10 text-slate-200 mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No activity logged yet</p>
              </div>
            ) : (
              <div className="relative">
                {/* Visual Connector Line: Centered exactly at 20px (half of w-10 node) */}
                <div className="absolute left-[19.5px] top-2 bottom-2 w-[1.5px] bg-slate-100" />

                <div className="space-y-12">
                  {visibleEvents.map((event) => {
                    const config = getEventConfig(event.type, event.message);
                    return (
                      <div key={event.id} className="relative pl-16 group">
                        {/* Status Node Node (Squarcle) */}
                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm z-10 transition-all group-hover:scale-110 ${config.bg} ${config.border}`}>
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

          {/* Footer Branding */}
          <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">End of Operational Log</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DistributorOrderTimelineDrawer;