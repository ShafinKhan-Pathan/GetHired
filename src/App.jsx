import "./App.css";
// Shadcnui Components Imports
import { ThemeProvider } from "@/components/theme-provider";

// React Router Dom Imports
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Your Own Components or Pages imports
import JobListingPage from "./pages/JobListingPage";
import JobPage from "./pages/JobPage";
import LandingPage from "./pages/LandingPage";
import MyJobsPage from "./pages/MyJobsPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import PostJobsPage from "./pages/PostJobsPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/Protected-Route";
import { Protect } from "@clerk/clerk-react";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <OnBoardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <JobListingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute>
            <PostJobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute>
            <SavedJobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute>
            <MyJobsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
