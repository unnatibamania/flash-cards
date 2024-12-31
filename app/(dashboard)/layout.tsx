"use client";

import { Navbar } from "@/components/Navbar/Navbar";

import { Aside } from "@/components/Sidebar/Aside";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";




export default function Layout({ children }: { children: React.ReactNode }) {
  // const route  r = useRouter();
const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
     
    <div className="flex h-screen overflow-hidden">
      <Aside  />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        {children}
      </div>
    </div>
    </QueryClientProvider>
  );
}
