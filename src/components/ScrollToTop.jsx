import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets window scroll to the top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset both document and window scroll positions
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      // Fallback in case of older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;