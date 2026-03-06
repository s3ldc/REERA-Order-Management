import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Calendar } from "../../../components/ui/calendar";

import { Filter, RotateCcw, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Filters {
  status: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FiltersPanel: React.FC<Props> = ({ filters, setFilters }) => {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  return (
    <Card className="bg-card rounded-2xl overflow-hidden border border-border">
      <CardHeader className="border-b border-border py-5 px-6 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span>Global Filters</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-3 text-[11px] font-black uppercase tracking-widest
              text-muted-foreground
              hover:text-destructive hover:bg-destructive/10
              rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* STATUS FILTER */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Fulfillment Status
            </Label>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full h-11 px-4 border border-border rounded-xl bg-muted text-sm font-medium text-foreground outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* START DATE */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Start Date
            </Label>

            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between rounded-xl bg-muted border-border"
                >
                  {filters.dateFrom
                    ? format(filters.dateFrom, "dd-MM-yyyy")
                    : "dd-mm-yyyy"}
                  <CalendarIcon className="h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 bg-card border-border">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => {
                    setFilters({ ...filters, dateFrom: date });
                    setFromOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* END DATE */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              End Date
            </Label>

            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between rounded-xl bg-muted border-border"
                >
                  {filters.dateTo
                    ? format(filters.dateTo, "dd-MM-yyyy")
                    : "dd-mm-yyyy"}
                  <CalendarIcon className="h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 bg-card border-border">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => {
                    setFilters({ ...filters, dateTo: date });
                    setToOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersPanel;
