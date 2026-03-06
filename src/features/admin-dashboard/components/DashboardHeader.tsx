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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          System Control
        </h1>

        <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          Administrator:{" "}
          <span className="text-foreground font-bold">
            {user?.name || user?.email}
          </span>
        </p>
      </div>

      <Button
        onClick={onManageUsers}
        className="
    bg-primary 
    text-primary-foreground 
    hover:bg-primary/90
    shadow-lg
    shadow-primary/25
    transition-all 
    hover:scale-[1.02] 
    active:scale-[0.98] 
    h-11 
    px-6 
    rounded-xl 
    flex 
    items-center 
    gap-2
    w-full md:w-auto
  "
      >
        <Users className="w-5 h-5" />
        Manage User Access
      </Button>
    </div>
  );
};

export default DashboardHeader;
