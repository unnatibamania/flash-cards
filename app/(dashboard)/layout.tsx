"use client";

import { Navbar } from "@/components/Navbar/Navbar";

import { Aside } from "@/components/Sidebar/Aside";



export default function Layout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();

  return (
    <div className="flex h-screen overflow-hidden">
      <Aside sets={0} draftSets={0} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
