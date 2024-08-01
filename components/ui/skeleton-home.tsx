import { Skeleton } from "@/components/ui/skeleton";

export function NavSkeleton() {
  return (
    <nav className="flex-1 pt-1 px-2 lg:px-4">
      <Skeleton className="h-5 w-24 mb-4 mx-auto" />{" "}
      {/* Skeleton for the "Tenants" heading */}
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 mb-4">
            <Skeleton className="h-6 w-1/2 flex-1" />{" "}
            <Skeleton className="h-6 w-6" /> {/* Skeleton for delete button */}
            <Skeleton className="h-6 w-6" /> {/* Skeleton for delete button */}
          </div>
        ))}
      </div>
    </nav>
  );
}
