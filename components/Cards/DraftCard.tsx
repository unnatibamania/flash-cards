"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock, Pencil, Trash } from "lucide-react";

import { Delete } from "../alert/Delete";

import { Pill } from "../Pill/Pill";

import { SetData } from "@/types/set";

import axios from "axios";

export const DraftCard = ({ draft }: { draft: SetData }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteDraft = async () => {
    try {
      await axios.delete(`/api/draft/${draft.id}`);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div
      key={draft.id}
      className="flex cursor-pointer hover:shadow-sm transition-all duration-300 border rounded-2xl p-4 flex-col gap-4"
    >
      <div className="flex flex-col">
        <h2 className="text-lg font-bold">{draft.title}</h2>
        <p className="text-xs text-gray-500">{draft.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {draft.tags.map((tag) => (
          <Pill tag={tag} onClick={() => {}} key={tag} hasAction={false} />
        ))}
      </div>

      <div className="flex justify-between">
        <p className="text-xs flex items-center gap-1 text-gray-500">
          {draft.is_public ? (
            <>
              <Unlock className="w-4 h-4" /> Public
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Private
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => {
            router.push(`/drafts/${draft.id}`);
          }}
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash className="w-4 h-4" />
          Delete
        </Button>
      </div>

      <Delete
        open={open}
        setOpen={setOpen}
        isLoading={isLoading}
        deleteDraft={deleteDraft}
        setIsLoading={setIsLoading}
        
      />
    </div>
  );
};
