import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import RootLayout from './layouts/rootLayout/RootLayout';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout';

import Dashboard from './routes/dashboard/Dashboard';
import Budget from './routes/budget/Budget';
import Home from './routes/home/Home';
import LoginPage from './routes/Login/LoginPage';
import SignUpPage from './routes/signUp/signUpPage.js';
import SettingsPage from './routes/Settings/settings';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/settings", element: <SettingsPage /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/budgets/:id", element: <Budget /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
