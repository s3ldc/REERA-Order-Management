import React from "react";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-slate-200/70 animate-pulse rounded-xl ${className}`} />
);

const DistributorDashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header Section */}
        <div className="mb-10 space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Stat Cards (3 cards only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <Skeleton className="h-3 w-28 mb-4" />
              <Skeleton className="h-6 w-12 mb-4" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Main Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Logistics Distribution */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <Skeleton className="h-4 w-40 mb-6" />
            <Skeleton className="h-72 w-full rounded-2xl mb-6" />

            {/* Bottom mini stats */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Revenue Health */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <Skeleton className="h-4 w-40 mb-6" />
            <Skeleton className="h-72 w-full rounded-2xl mb-6" />

            {/* Paid / Unpaid bars */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboardSkeleton;