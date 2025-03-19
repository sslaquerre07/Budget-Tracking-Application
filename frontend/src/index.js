import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './routes/dashboard/Dashboard.js';
import Budget from './routes/budget/Budget.js';
import Home from './routes/home/Home.js';
import RootLayout from './layouts/rootLayout/RootLayout.js';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout.js';
import LoginPage from './routes/Login/LoginPage.js';
import SignUpPage from './routes/signUp/SignUpPage.js';
import SettingsPage from './routes/Settings/settings.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/dashboard/budgets/:id",
            element: <Budget />
          }
        ]
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);