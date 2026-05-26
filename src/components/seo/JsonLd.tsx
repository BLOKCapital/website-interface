/**
 * Renders one or more JSON-LD schema objects as a <script> tag. Server
 * component — the markup is emitted in the initial HTML so crawlers see the
 * structured data without executing JavaScript.
 *
 * dangerouslySetInnerHTML is the documented Next.js pattern for JSON-LD; the
 * payload is our own static schema (never user input), so there's no injection
 * surface here.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
