import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Dashboard from './routes/dashboard/Dashboard.js';
import Budget from './routes/budget/Budget.js';
import Home from './routes/home/Home.js';
import RootLayout from './layouts/rootLayout/RootLayout.js';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout.js';
import SignInPage from './routes/signIn/SignInPage.js';
import SignUpPage from './routes/signUp/SignUpPage.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([  
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
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
          },
        ]
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignOutUrl="/"
      >
        <RouterProvider router={router} />
      </ClerkProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
