"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";
import { Provider } from "react-redux";

import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { store } from "@/store";
import { SocketInitializer } from "./SocketInitializer";
import { ThemeProvider } from "./ThemeProvider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer>
            <SocketInitializer>{children}</SocketInitializer>
          </AuthInitializer>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
