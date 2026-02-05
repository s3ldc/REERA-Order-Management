import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";

export const useOrderTimeline = (orderId: string) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    pb.collection("order_events")
      .getFullList({
        filter: `order_id="${orderId}"`,
        sort: "-created",
        expand: "actor_id",
      })
      .then(setEvents);

    pb.collection("order_events").subscribe("*", (e) => {
      if (e.record.order_id === orderId) {
        setEvents((prev) => [e.record, ...prev]);
      }
    });

    return () => {
      pb.collection("order_events").unsubscribe("*");
    };
  }, [orderId]);

  return events;
};