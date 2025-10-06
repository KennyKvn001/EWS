import Layout from "@/views/Layout";
import { createBrowserRouter } from "react-router";
import AtRiskView from "@/views/AtRiskView";
import Simulations from "@/views/Simulations";
import Prediction from "@/views/Prediction";
import HomeOverview from "@/views/HomeOverview";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
        path: "/at-risk-view",
        element: <AtRiskView />,
      },
      {
        path: "/simulation",
        element: <Simulations />,
      },
    ],
  },
])

export default routes;