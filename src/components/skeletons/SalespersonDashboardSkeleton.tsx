const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-slate-200 rounded animate-pulse ${className}`} />
);

const SalespersonDashboardSkeleton = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-64" />
          <SkeletonBlock className="h-4 w-48" />
        </div>

        <SkeletonBlock className="h-10 w-48 rounded-xl" />
      </div>

      {/* Stat Cards (3 for Salesperson) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
          >
            <SkeletonBlock className="h-3 w-32 mb-4" />
            <SkeletonBlock className="h-8 w-10" />
          </div>
        ))}
      </div>

      {/* Mid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <SkeletonBlock className="h-4 w-40 mb-6" />
            <SkeletonBlock className="h-[280px] w-full rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Bottom Panel (Sales Velocity) */}
      <div className="mt-10">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <SkeletonBlock className="h-4 w-40 mb-6" />
          <SkeletonBlock className="h-[250px] w-full rounded-2xl" />
        </div>
      </div>
    </main>
  );
};

export default SalespersonDashboardSkeleton;