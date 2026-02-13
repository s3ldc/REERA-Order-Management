const AppSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 bg-white border-b border-slate-100 flex items-center px-6">
        <div className="h-8 w-40 bg-slate-200 rounded-xl" />
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <div className="h-40 bg-white rounded-3xl shadow-sm border border-slate-100" />
        <div className="h-40 bg-white rounded-3xl shadow-sm border border-slate-100" />
        <div className="h-40 bg-white rounded-3xl shadow-sm border border-slate-100" />
      </div>
    </div>
  );
};

export default AppSkeleton;