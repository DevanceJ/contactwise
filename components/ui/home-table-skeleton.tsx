import { Skeleton } from "@/components/ui/skeleton";

export function HomeTableSkeleton() {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-left">Name</th>
          <th className="border p-2 text-left">Email</th>
          <th className="border p-2 text-left">Role</th>
          <th className="border p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index}>
            <td className="border p-2">
              <Skeleton className="h-4 w-3/4" />
            </td>
            <td className="border p-2">
              <Skeleton className="h-4 w-3/4" />
            </td>
            <td className="border p-2">
              <Skeleton className="h-4 w-1/2" />
            </td>

            <td className="border p-2">
              <Skeleton className="h-4 w-16" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
