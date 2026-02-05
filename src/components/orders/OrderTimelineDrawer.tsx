import { X, Clock, User } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useOrderTimeline } from "../../hooks/useOrderTimeline";
import type { Order } from "../../context/OrderContext";

interface Props {
  order: Order;
  onClose: () => void;
}

const OrderTimelineDrawer: React.FC<Props> = ({ order, onClose }) => {
  const { events, loading } = useOrderTimeline(order.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-full shadow-xl animate-slide-in-right">
        <Card className="h-full rounded-none border-none">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <h3 className="font-bold text-lg">Order Timeline</h3>
              <p className="text-xs text-slate-500">
                {order.spa_name} • {order.product_name}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-6 overflow-y-auto">
            {/* Loading */}
            {loading && (
              <p className="text-sm text-slate-400 text-center mt-10">
                Loading timeline…
              </p>
            )}

            {/* Empty */}
            {!loading && events.length === 0 && (
              <p className="text-sm text-slate-400 text-center mt-10">
                No activity recorded yet <br />
                Timeline events will appear when this order is updated.
              </p>
            )}

            {/* Timeline */}
            {!loading && events.length > 0 && (
              <ol className="relative border-l border-slate-200 space-y-6">
                {events.map((event) => (
                  <li key={event.id} className="ml-6">
                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full">
                      <Clock className="w-3 h-3 text-indigo-600" />
                    </span>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {event.type.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {new Date(event.created).toLocaleString()}
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
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTimelineDrawer;