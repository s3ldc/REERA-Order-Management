import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";

export const useOrderTimeline = (orderId: string) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    pb.collection("order_events")
      .getFullList({
        filter: `order_id="${orderId}"`,
        sort: "-created",
        expand: "actor_id",
      })
      .then((records) => {
        if (!isMounted) return;
        setEvents(records);
        setLoading(false); // ✅ IMPORTANT
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false); // ✅ IMPORTANT
      });

    const unsubscribe = pb
      .collection("order_events")
      .subscribe("*", (e) => {
        if (e.record.order_id === orderId) {
          setEvents((prev) => [e.record, ...prev]);
        }
      });

    return () => {
      isMounted = false;
      pb.collection("order_events").unsubscribe("*");
    };
  }, [orderId]);

  return { events, loading };
};