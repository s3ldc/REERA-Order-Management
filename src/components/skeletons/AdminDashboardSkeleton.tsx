const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse">
    <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
    <div className="h-8 w-12 bg-slate-300 rounded" />
  </div>
);

const LargePanelSkeleton = () => (
  <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm animate-pulse">
    <div className="h-4 w-40 bg-slate-200 rounded mb-6" />
    <div className="h-64 bg-slate-100 rounded-2xl" />
  </div>
);

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-slate-300 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
          </div>

          <div className="h-10 w-48 bg-indigo-200 rounded-xl animate-pulse" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Analytics Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <LargePanelSkeleton />
          <LargePanelSkeleton />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;