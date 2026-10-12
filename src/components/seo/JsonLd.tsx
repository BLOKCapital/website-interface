/**
 * Renders one or more JSON-LD schema objects as a <script> tag. Server
 * component — the markup is emitted in the initial HTML so crawlers see the
 * structured data without executing JavaScript.
 *
 * dangerouslySetInnerHTML is the documented Next.js pattern for JSON-LD.
 * Every `<` is escaped as < (still valid JSON), so no string in a
 * schema, now or once data such as proposal titles flows in, can close the
 * script tag early (SEC-24, SEO-21).
 */
const serialise = (schema: object) => JSON.stringify(schema).replace(/</g, "\\u003c");

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialise(schema) }} />
      ))}
    </>
  );
}
