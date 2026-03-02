import { useAuth } from "@/context/AuthContext";

const SkeletonBlock = ({ className }: { className: string }) => (
  <div
    className={`relative overflow-hidden rounded bg-muted ${className}`}
  >
    <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
  </div>
);

const AppShellSkeleton = () => {
  const { user } = useAuth();
  const role = user?.role;

  const statCount =
    role === "Admin" ? 4 :
    role === "Distributor" ? 3 :
    3;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
        <div className="space-y-3">
          <SkeletonBlock className="h-7 w-52" />
          <SkeletonBlock className="h-4 w-40" />
        </div>

        <SkeletonBlock className="h-10 w-40 rounded-xl" />
      </div>

      {/* Stat Cards */}
      <div
        className={`grid gap-6 mt-8 ${
          statCount === 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {[...Array(statCount)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border p-5 shadow-sm"
          >
            <SkeletonBlock className="h-3 w-28 mb-4" />
            <SkeletonBlock className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-3xl border border-border p-6 shadow-sm"
          >
            <SkeletonBlock className="h-4 w-36 mb-6" />
            <SkeletonBlock className="h-[220px] sm:h-[260px] w-full rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Bottom Panel */}
      <div className="mt-8">
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
          <SkeletonBlock className="h-4 w-36 mb-6" />
          <SkeletonBlock className="h-[200px] sm:h-[240px] w-full rounded-2xl" />
        </div>
      </div>

    </main>
  );
};

export default AppShellSkeleton;