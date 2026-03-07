import React from "react";
import { Truck } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface Props {
  user: Doc<"users"> | null;
}

const DashboardHeader: React.FC<Props> = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Logistics Overview
        </h1>

        <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary" />
          Welcome back{" "}
          <span className="text-foreground font-bold">
            {user?.name || user?.email}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;