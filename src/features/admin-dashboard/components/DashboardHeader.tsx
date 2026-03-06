import React from "react";
import { Button } from "../../../components/ui/button";
import { Users } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface Props {
  user: Doc<"users"> | null;
  onManageUsers: () => void;
}

const DashboardHeader: React.FC<Props> = ({ user, onManageUsers }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border">

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          System Control
        </h1>

        <p className="text-muted-foreground mt-2">
          Administrator:{" "}
          <span className="font-bold">
            {user?.name || user?.email}
          </span>
        </p>
      </div>

      <Button
        onClick={onManageUsers}
        className="bg-primary text-primary-foreground h-11 px-6 rounded-xl flex items-center gap-2"
      >
        <Users className="w-5 h-5" />
        Manage User Access
      </Button>

    </div>
  );
};

export default DashboardHeader;