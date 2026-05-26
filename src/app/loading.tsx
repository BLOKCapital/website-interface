import { SeedLoader } from "@/components/ui/SeedLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SeedLoader />
    </div>
  );
}
