import { SeedLoader } from "@/components/ui/SeedLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center">
      <SeedLoader />
    </div>
  );
}
