import { useAuth } from "@/context/AuthContext";

const SkeletonBlock = ({ className }: { className: string }) => (
  <div
    className={`relative overflow-hidden rounded bg-slate-200 ${className}`}
  >
    <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

const AppShellSkeleton = () => {
  const { user } = useAuth();

  const role = user?.role;

  const statCount =
    role === "Admin" ? 4 :
    role === "Distributor" ? 3 :
    3; // Salesperson

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-64" />
          <SkeletonBlock className="h-4 w-48" />
        </div>

        <SkeletonBlock className="h-10 w-44 rounded-xl" />
      </div>

      {/* Stat Cards */}
      <div className={`grid gap-6 mt-10 ${
        statCount === 4
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      }`}>
        {[...Array(statCount)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
          >
            <SkeletonBlock className="h-3 w-32 mb-4" />
            <SkeletonBlock className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <SkeletonBlock className="h-4 w-40 mb-6" />
            <SkeletonBlock className="h-[260px] w-full rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Bottom Panel */}
      <div className="mt-10">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <SkeletonBlock className="h-4 w-40 mb-6" />
          <SkeletonBlock className="h-[240px] w-full rounded-2xl" />
        </div>
      </div>
    </main>
  );
};

export default AppShellSkeleton;