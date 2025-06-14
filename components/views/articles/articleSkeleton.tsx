import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetailSkeleton() {
  return (
    <div className="bg-white py-8 md:py-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center md:text-left space-y-4">
          <div className="flex justify-center md:justify-start">
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>

          <div className="flex justify-center md:justify-start pt-2">
            <Skeleton className="h-6 w-48" />
          </div>
        </header>

        <Skeleton className="w-full aspect-video rounded-lg mb-8" />

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-full mt-6" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
        </div>
      </article>
    </div>
  );
}
