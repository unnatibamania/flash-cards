'use client'

import { useUser } from "@clerk/nextjs";

import { useRouter } from "next/navigation";

import { useEffect } from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  const { isSignedIn } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }else{
      router.push("/signin");
    }
  }, [isSignedIn, router]);

  return (
    <div className="grid grid-cols-2 h-screen w-full">
        <div className="bg-gray-800"></div>
        <div className="bg-gray-50 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };
  
  export default AuthLayout;