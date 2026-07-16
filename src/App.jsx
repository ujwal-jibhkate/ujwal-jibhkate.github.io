import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

/**
 * App, root layout. Paper background + ink text live here (Sheet, the
 * per-page content container, is deliberately background-agnostic, it
 * only establishes the 1140px grid, see components/paper/Sheet.jsx), so
 * this is the single place that paints the page.
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Navigation />

      {/* Reset scroll to top on every route change */}
      <ScrollToTop />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
