import { Loader2 } from "lucide-react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

type SpinnerProps = {
  size?: SpinnerSize;
};

const sizeMap: Record<SpinnerSize, number> = {
  sm: 24,
  md: 40,
  lg: 56,
  xl: 72,
};

export function Spinner({ size = "md" }: SpinnerProps) {
  const pixelSize = sizeMap[size];

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2
        width={pixelSize}
        height={pixelSize}
        className="animate-spin text-primary"
      />
    </div>
  );
}
