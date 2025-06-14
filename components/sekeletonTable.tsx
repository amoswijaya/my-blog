import { Skeleton } from "@/components/ui/skeleton";
type TableColumn = {
  label: string;
  className?: string;
};
export function TableSkeleton({ columns }: { columns: TableColumn[] }) {
  const rows = Array(10).fill(null);

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            {columns.map((col, i) => (
              <th className="p-3" key={i}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((_, i) => (
            <tr key={i} className="border-b border-gray-200">
              {columns.map((col, j) => (
                <td className={`p-3 `} key={j}>
                  <Skeleton className="h-6 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
