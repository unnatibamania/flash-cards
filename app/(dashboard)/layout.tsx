"use client"

import { useRouter } from "next/navigation";



import { useAuth } from "@clerk/nextjs";

export default function Layout() {
  // const router = useRouter();

  const { signOut, userId } = useAuth();

  
  const router = useRouter();
  console.log(userId);

  return <div>
    hii

    <button onClick={() => {
      router.push("/signin");
      signOut()}}>
      Logout 
    </button>
  </div>;
}
