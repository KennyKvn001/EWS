import Layout from "@/views/Layout";
import Home from "@/views/Home";
import { createBrowserRouter } from "react-router";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/performance-trends",
        element: <div>Performance Trends Page</div>,
      },
      {
        path: "/predictions",
        element: <div>Predictions Page</div>,
      },
      {
        path: "/simulation",
        element: <div>Simulation Page</div>,
      },
      {
        path: "/student-overview",
        element: <div>Student Overview Page</div>,
      },
      {
        path: "/settings",
        element: <div>Settings Page</div>,
      },
    ],
  },
])

export default routes;