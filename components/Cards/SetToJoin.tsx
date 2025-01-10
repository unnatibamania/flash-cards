"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SetData } from "@/types/set";
import { useState } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Pill } from "../Pill/Pill";


export const SetToJoin = ({ set }: { set: SetData }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/set/join", {
        setId: set.id,
      });

      router.push(`/set/${set.id}`);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex cursor-pointer border rounded-2xl p-4 flex-col gap-4">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold">{set.title}</h2>
        <p className="text-xs text-gray-500">{set.description}</p>
      </div>
      <div className=" flex gap-x-1">
        {set.tags.map((title) => (
          <Pill tag={title} onClick={() => {}} hasAction={false} key={title} />
        ))}
      </div>
      <section className="flex items-center justify-between">
        <div>
          <p>43 cards</p>
        </div>
        <div className="flex items-center -space-x-3 relative">
          {set.users_enrolled.slice(0, 3).map((user) => (
            <Avatar key={user.id}>
              <AvatarImage src={user.profile_picture} />
              {/* <AvatarFallback>{user.id.slice(0, 2)}</AvatarFallback> */}
            </Avatar>
          ))}

          {
            set.users_enrolled.length > 3 ? (
              <Avatar>
                <AvatarFallback>{set.users_enrolled.length}</AvatarFallback>
              </Avatar>
            ) : null
          }
          {/* <Avatar>
            <AvatarImage src="https://github.com/itsnitinr.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar className=" ">
            <AvatarImage src="https://github.com/ameybh.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar className="">
            <AvatarImage src="https://github.com/unnatibamania.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar className="">
            <AvatarFallback>+4</AvatarFallback>
          </Avatar> */}
        </div>
      </section>
      <div className="flex items-center justify-between">
        <div>
          Created by <span className="font-bold">Nitin</span>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            handleJoin();
          }}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : null} Join
        </Button>
      </div>
    </div>
  );
};
