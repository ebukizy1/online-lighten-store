import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen"; // you already have this

import { QueryClient } from "@tanstack/react-query";

// create query client
const queryClient = new QueryClient();

// create router
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

// render app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);