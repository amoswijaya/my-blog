// components/EmptyState.tsx
import { FileSearch } from "lucide-react";

export default function EmptyState({
  title = "No articles found",
  description = "Try adjusting your filters or add a new article.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
      <FileSearch className="w-12 h-12 mb-4 text-gray-400" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  );
}
