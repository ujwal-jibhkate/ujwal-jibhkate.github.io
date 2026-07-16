/**
 * ErrorPage, on-brand 404 / route-error fallback.
 *
 * Wired two ways in main.jsx:
 *  1. As the top-level route's `errorElement`, so it catches the `*`
 *     catch-all (unmatched paths) and any unexpected render/loader errors
 *     bubbling from other routes.
 *  2. As `/work/:slug`'s own `errorElement`, so it catches the 404
 *     `Response` thrown by `workLoader` (see SystemPage.jsx), both "slug
 *     doesn't exist" and "slug exists but has no detail page" land here.
 *
 * `useRouteError()` is safe to call unconditionally: React Router's data
 * router always supplies a value (a thrown `Response`, an `Error`, or
 * whatever was thrown) when this component is rendered as an
 * `errorElement`. Branching on `error.status` is optional polish, a 404
 * gets the "nothing here" copy, anything else gets a generic apology,
 * but the page renders the same on-brand chrome either way.
 */
import { Link, useRouteError } from 'react-router-dom';
import Sheet from '../components/paper/Sheet';
import RunningHead from '../components/paper/RunningHead';
import PageTitle from '../components/paper/PageTitle';
import P from '../components/paper/P';

const LINK_CLASS = 'text-accent underline-offset-2 hover:underline focus:underline';

export default function ErrorPage() {
  const error = useRouteError();
  const status = error && typeof error === 'object' ? error.status : undefined;
  const isUnexpected = status != null && status !== 404;

  return (
    <>
      <RunningHead left="Ujwal Jibhkate · Selected Systems" center="Not Found" page="404" />
      <Sheet>
        <PageTitle size="h1">{isUnexpected ? 'Something went wrong' : 'Page not found'}</PageTitle>
        <P>
          {isUnexpected
            ? 'That request didn’t resolve the way it should have. '
            : 'There’s no page at this address: the system either doesn’t exist, or hasn’t been written up as a full entry yet. '}
          Back to the <Link to="/" className={LINK_CLASS}>front matter</Link>, or the{' '}
          <Link to="/work" className={LINK_CLASS}>index of systems</Link>.
        </P>
      </Sheet>
    </>
  );
}
