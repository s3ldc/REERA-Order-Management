const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-slate-200 rounded ${className} animate-pulse`} />
);

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Sticky Header (matches real app) */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <SkeletonBlock className="h-3 w-32" />
              <SkeletonBlock className="h-2 w-20" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <SkeletonBlock className="h-8 w-24 rounded-full" />
            <SkeletonBlock className="h-8 w-16 rounded" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-64" />
            <SkeletonBlock className="h-4 w-48" />
          </div>

          <SkeletonBlock className="h-10 w-48 rounded-xl" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
            >
              <SkeletonBlock className="h-3 w-24 mb-4" />
              <SkeletonBlock className="h-8 w-10" />
            </div>
          ))}
        </div>

        {/* Analytics Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
            >
              <SkeletonBlock className="h-4 w-40 mb-6" />
              <SkeletonBlock className="h-[300px] w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardSkeleton;