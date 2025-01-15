"use client";

import { SetData } from "@/types/set";
import axios from "axios";

import { CardData } from "@/types/card";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Progress } from "../ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Delete } from "../alert/Delete";

import { Bookmark, } from "lucide-react";

import { useState } from "react";

export const SetCard = ({ set }: { set: SetData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: cardsList } = useQuery({
    queryKey: ["cards", set.id],
    queryFn: () => axios.get(`/api/card/${set.id}`).then((res) => res.data),
  });

  const visitedCards = cardsList?.filter((card: CardData) => card.is_visited);

  const percentage = (visitedCards?.length / cardsList?.length) * 100;

  const deleteSet = async () => {
    try {
      await axios.delete(`/api/draft/${set.id}`);
    } catch (error) {
      console.log({ error });
    }
  };

  const toggleBookmark = async () => {
    // Get the current query client
    const previousSets = queryClient.getQueryData<SetData[]>(["sets"]);
    
    // Optimistically update the UI
    queryClient.setQueryData<SetData[]>(["sets"], (old) => 
      old?.map((s) => 
        s.id === set.id ? { ...s, is_bookmarked: !s.is_bookmarked } : s
      )
    );

    try {
      await axios.patch(`/api/set/bookmark/${set.id}`);
    } catch (error) {
      // On error, rollback to the previous state
      queryClient.setQueryData(["sets"], previousSets);
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <div className="flex cursor-pointer border rounded-2xl p-4 flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col max-w-[calc(100%-48px)]">
          <h2 className="text-lg font-bold">{set?.title}</h2>
          <p className="text-xs text-gray-500">{set?.description}</p>
        </div>

        <Bookmark 
          size={24} 
          className={`shrink-0 cursor-pointer ${set.is_bookmarked ? 'fill-current' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark();
          }} 
        />
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
          {set.users_enrolled.slice(0, 4).map((user) => (
            <Avatar key={user.id}>
              <AvatarImage src={user.profile_picture} />
            </Avatar>
          ))}

          {set.users_enrolled.length > 4 ? (
            <Avatar className="bg-gray-200 text-gray-500">
              <AvatarFallback>{set.users_enrolled.length - 4}</AvatarFallback>
            </Avatar>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              // await deleteSet();
              setOpen(true);
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              router.push(`/set/${set.id}`);
            }}
          >
            Continue
          </Button>
        </div>
      </div>

      <Delete
        open={open}
        setOpen={setOpen}
        isLoading={isLoading}
        deleteDraft={deleteSet}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};
