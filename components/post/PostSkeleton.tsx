import { Skeleton } from "../ui/skeleton";

export function PostSkeleton() {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  } 

  export function PostListSkeleton() {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }