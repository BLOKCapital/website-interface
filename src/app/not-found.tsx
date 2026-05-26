import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="script text-[26px] text-clay">a path overgrown</p>
      <h1 className="display mt-3 text-[56px] leading-none text-ink sm:text-[72px]">
        404
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-muted">
        This corner of the garden hasn&apos;t been planted yet, the page you
        were looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/">Back to the garden</Button>
        <Button href="/contact" variant="outline">
          Get in touch
        </Button>
      </div>
    </section>
  );
}
