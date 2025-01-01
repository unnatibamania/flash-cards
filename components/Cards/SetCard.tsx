"use client"

import { SetData } from "@/types/set";
import axios from "axios";

import { CardData } from "@/types/card";

import { useQuery } from "@tanstack/react-query";

import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const SetCard = ({ set, index }: { set: SetData; index: number }) => {
  const router = useRouter();
 
  const { data: cardsList } = useQuery({
    queryKey: ["cards", set.id],
    queryFn: () =>
      axios.get(`/api/card/${set.id}`).then((res) => res.data),
  });

  const visitedCards = cardsList?.filter((card: CardData) => card.is_visited);

  const percentage = (visitedCards?.length / cardsList?.length) * 100;
  
 
  return (
    <div
      key={index}
      className="flex cursor-pointer border rounded-2xl p-4 flex-col gap-4"
    >
      <div className="flex flex-col">
        <h2 className="text-lg font-bold">{set.title}</h2>
        <p className="text-xs text-gray-500">{set.description}</p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <p>Progress</p>

          <p className="text-xs">
            {visitedCards?.length} / {cardsList?.length} cards
          </p>
        </div>

        <Progress value={percentage} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center -space-x-3 relative">
          <Avatar>
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
            {/* <AvatarImage src="https://github.com/.png" /> */}
            <AvatarFallback>+4</AvatarFallback>
          </Avatar>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            router.push(`/cards/${set.id}`);
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
