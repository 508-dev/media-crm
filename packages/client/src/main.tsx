import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { trpc, trpcClient } from "./trpc";

const queryClient = new QueryClient();
const root = document.getElementById("root") as HTMLElement;

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </trpc.Provider>
    </React.StrictMode>,
  );
}
