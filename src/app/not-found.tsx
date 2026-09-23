import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { GardenAsset } from "@/components/ui/GardenAsset";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[80vh] w-full max-w-page items-center gap-10 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-4 text-h1 text-fg">Nothing planted here.</h1>
        <p className="mt-6 max-w-md text-lead text-fg-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/protocol" variant="secondary">
            How the protocol works
          </Button>
        </div>
      </div>
      <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] opacity-80 lg:block">
        <GardenAsset n={7} sizes="420px" />
      </div>
    </section>
  );
}
