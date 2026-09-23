/**
 * Route-level loading state. With a static export and prefetched links this
 * rarely shows; when it does, it's a quiet skeleton of a page header rather
 * than a blank screen or a spinner.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="mx-auto w-full max-w-page px-5 pb-24 pt-40 sm:px-8">
      <span className="sr-only">Loading…</span>
      <div className="h-3 w-32 animate-pulse rounded-full bg-line/10" />
      <div className="mt-6 h-12 w-full max-w-2xl animate-pulse rounded-xl bg-line/10" />
      <div className="mt-4 h-12 w-2/3 max-w-xl animate-pulse rounded-xl bg-line/10" />
      <div className="mt-8 h-5 w-full max-w-xl animate-pulse rounded-full bg-line/[0.07]" />
      <div className="mt-3 h-5 w-5/6 max-w-lg animate-pulse rounded-full bg-line/[0.07]" />
    </div>
  );
}
