"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save, DraftingCompass } from "lucide-react";
import { CardData } from "@/types/card";

import { useRouter } from "next/navigation";

import axios from "axios";

export const SetDetails = ({
  title,
  description,
  tags,
  cards,
  isPublic,
  setIsPublic,
}: {
  title: string;
  description: string;
  tags: string[];
  cards: CardData[];
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false)
  
  const router = useRouter();

  const handleCreateSet = async ({isDraft}: {isDraft: boolean}) => {
    setIsLoading(true);

    if(isDraft) {
      setIsDraftLoading(true);
    }

    try {
      const {data} = await axios.post("/api/set", {
        title,
        description,
        tags,
        is_public: isPublic,
        is_draft: isDraft,
      });

      const {data: cardsData} = await axios.post("/api/card", {
        cards_list: cards,
        set_id: data.id,
      })

      console.log(cardsData);

      if(isDraft){
        router.push('/drafts');
      }else{
        router.push('/my-sets');
      }

      setIsLoading(false);
      setIsDraftLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsDraftLoading(false);
    }
    
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex bg-white shadow-sm p-4  rounded-xl justify-between">
        <div className="flex flex-col h-fit">
          <h1 className="text-lg font-medium">
            Do you want to make it public ?
          </h1>
          <p className="text-sm text-gray-500">
            Share your cards with the world
          </p>
        </div>

        <Switch checked={isPublic} onCheckedChange={setIsPublic} />

      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col h-fit gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium">Are you ready?</h1>
          <p className="text-sm text-gray-500">
            You can always edit your cards later
          </p>
        </div>

        <div className="flex gap-2">
          <Button   disabled={isLoading || isDraftLoading}
         variant="outline" onClick={() => {
            handleCreateSet({isDraft: true})}}>
          {isDraftLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <DraftingCompass className="h-4 w-4" />}
            Save as draft
          </Button>
          <Button 
          disabled={isLoading || isDraftLoading}
          onClick={() => {
          
            handleCreateSet({isDraft: false})
          }}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Create set{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};
