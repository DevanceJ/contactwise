import { Skeleton } from "@/components/ui/skeleton";

export function SideNavSkeleton() {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
      <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-24" />{" "}
          {/* Skeleton for the "Tenants" heading */}
          <Skeleton className="h-6 w-6" /> {/* Skeleton for the close button */}
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 mb-4">
              <Skeleton className="h-6 w-1/2 flex-1" />{" "}
              {/* Skeleton for tenant name */}
              <Skeleton className="h-6 w-6" /> <Skeleton className="h-6 w-6" />{" "}
              {/* Skeleton for delete button */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
