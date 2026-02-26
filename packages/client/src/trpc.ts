import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../server/src/routers/index";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/trpc",
      fetch(url, options) {
        const sessionId = localStorage.getItem("sessionId");
        return fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            ...options?.headers,
            ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
          },
        });
      },
    }),
  ],
});
