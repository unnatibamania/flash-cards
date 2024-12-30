"use client";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";

import { useAuth } from "@clerk/nextjs";

import { LogOut } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const router = useRouter();

  const { user } = useUser();

  const { signOut } = useAuth();

  return (
    <nav className="flex items-center p-2 shadow-sm border-b border-gray-200 justify-between">
      <Input
        placeholder="Search"
        // startContent={<Search className="w-4 h-4" />}
        className="min-w-96 max-w-96"
      />

      <div className="flex items-center gap-4">
        <Button onClick={() => router.push("/create")}>
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </Button>

        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-gray-500">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>

            <Button
              onClick={async () => {
                await signOut();
                router.push("/signin");
              }}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};
