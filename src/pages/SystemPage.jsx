/**
 * SystemPage, `/work/:slug`, a single system's detail page.
 *
 * Loader-throw design (over a component-level check): `workLoader` looks
 * up `getWorkBySlug(params.slug)` and throws a `Response('Not Found', 404)`
 * whenever there's nothing renderable, either the slug doesn't exist in
 * the registry, OR it exists but `hasDetail` is `false` (so `body` is
 * `undefined`). Both cases collapse to the exact same thrown Response, so
 * both land on the exact same <ErrorPage/> via the route's `errorElement`
 * (wired in main.jsx), there is no path where this component itself has
 * to branch on "did I get real data," because React Router guarantees a
 * loader-throwing route never renders its element. That keeps this
 * component's body a single, unconditional happy path: it can destructure
 * `{ meta, body }` from `useLoaderData()` and trust `body` is always a
 * real node, never `undefined`. The alternative (checking `hasDetail` /
 * `body` inside the component and rendering `<ErrorPage/>` inline) would
 * work too, but would leave two places doing 404 detection instead of one,
 * and would require this component to still import and understand
 * ErrorPage's contract. Throwing at the loader boundary is the cleaner
 * single source of truth.
 */
import { useLoaderData } from 'react-router-dom';
import Sheet from '../components/paper/Sheet';
import RunningHead from '../components/paper/RunningHead';
import PageTitle from '../components/paper/PageTitle';
import StatusTag from '../components/paper/StatusTag';
import Ref from '../components/paper/Ref';
import { getWorkBySlug } from '../content/work/index.js';

/**
 * React Router loader for this route. Wired in main.jsx alongside an
 * `errorElement={<ErrorPage />}` on the same route entry, see the file
 * header comment above for why both "slug not found" and "no detail page"
 * are collapsed into the same thrown 404 Response.
 *
 * @param {{ params: { slug: string } }} args
 */
// React Router's loader pattern colocates the loader with its route
// component by design (see React Router's own docs); this file
// intentionally exports both, and Fast Refresh's per-file constraint is a
// dev-only convenience that doesn't affect production behavior.
// eslint-disable-next-line react-refresh/only-export-components
export function workLoader({ params }) {
  const result = getWorkBySlug(params.slug);
  if (!result || !result.body) {
    throw new Response('Not Found', { status: 404 });
  }
  return result;
}

export default function SystemPage() {
  const { meta, body } = useLoaderData();

  return (
    <>
      <RunningHead
        left="Ujwal Jibhkate · Selected Systems"
        center={meta.title}
        page={meta.section + 2}
      />
      <Sheet>
        <PageTitle size="h1" subtitle={meta.subtitle}>
          {meta.title}
        </PageTitle>

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-[26px] font-serif italic text-[12.5px] text-soft">
          <StatusTag status={meta.status} label={meta.statusLabel} />
          {meta.links?.map((link) => (
            <span key={link.url}>
              <Ref href={link.url}>{link.text}</Ref>
            </span>
          ))}
        </div>

        {body}
      </Sheet>
    </>
  );
}
