// Router, see src/pages/SystemPage.jsx for the workLoader/errorElement
// design (both "unknown slug" and "slug with no detail page" collapse to
// the same thrown 404 Response, caught by ErrorPage below).
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import WorkIndexPage from './pages/WorkIndexPage.jsx';
import SystemPage, { workLoader } from './pages/SystemPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'work', element: <WorkIndexPage /> },
      {
        path: 'work/:slug',
        element: <SystemPage />,
        loader: workLoader,
        errorElement: <ErrorPage />,
      },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
