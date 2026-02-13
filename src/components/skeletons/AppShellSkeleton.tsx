const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-slate-200 rounded animate-pulse ${className}`} />
);

const AppShellSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-8 w-24 rounded-full" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Title Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-72" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
          <SkeletonBlock className="h-10 w-44 rounded-xl" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
            >
              <SkeletonBlock className="h-3 w-32 mb-4" />
              <SkeletonBlock className="h-8 w-12" />
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        {/* Bottom Section */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <SkeletonBlock className="h-4 w-40 mb-6" />
          <SkeletonBlock className="h-[250px] w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
};

export default AppShellSkeleton;