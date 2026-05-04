import { Container } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full aspect-square rounded-2xl mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

function ProductGroupSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[50px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <>
      {/* Title */}
      <Container className="mt-6 md:mt-10">
        <Skeleton className="h-9 w-56 mb-3 md:mb-5" />
      </Container>

      {/* TopBar skeleton */}
      <div className="sticky top-0 z-10 bg-white py-5 shadow-lg shadow-black/5">
        <Container className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-2xl shrink-0" />
            ))}
          </div>
          {/* Sort + Filter */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            <Skeleton className="h-10 w-24 rounded-xl md:h-[52px] md:w-28 md:rounded-2xl" />
            <Skeleton className="h-10 w-28 rounded-xl md:h-[52px] md:w-36 md:rounded-2xl" />
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container className="pb-14 mt-10">
        <div className="flex gap-0 md:gap-6 lg:gap-10 xl:gap-[100px]">
          {/* Sidebar skeleton */}
          <div className="hidden md:flex flex-col gap-4 w-[250px] shrink-0">
            <Skeleton className="h-6 w-32 mb-2" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
            <Skeleton className="h-6 w-32 mt-4 mb-2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>

          {/* Product groups */}
          <div className="flex-1 flex flex-col gap-16">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductGroupSkeleton key={i} />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
