import Layout from "@/views/Layout";
import { createBrowserRouter, Navigate } from "react-router";
import StudentsView from "@/views/StudentsView";
import Simulations from "@/views/Simulations";
import Prediction from "@/views/Prediction";
import HomeOverview from "@/views/HomeOverview";
import Login from "@/views/Login";
import SignUpPage from "@/views/SignUp";
import PrivacyPolicy from "@/views/PrivacyPolicy";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
      <SignedOut>{children}</SignedOut>
    </>
  );
};

const routes = createBrowserRouter([
  {
    path: "/login/*",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/sign-up/*",
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <HomeOverview />,
      },
      {
        path: "/predictions",
        element: <Prediction />,
      },
      {
        path: "/students",
        element: <StudentsView />,
      },
      {
        path: "/simulation",
        element: <Simulations />,
      },
    ],
  },
]);

export default routes;
