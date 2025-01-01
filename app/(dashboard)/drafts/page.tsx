"use client";

import { SetData } from "@/types/set";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { DraftCard } from "@/components/Cards/DraftCard";

const Drafts = () => {
  const { data: draftList } = useQuery({
    queryKey: ["drafts"],
    queryFn: () => axios.get("/api/draft").then((res) => res.data),
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Drafts</h1>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {draftList?.map((draft: SetData, index: number) => (
          <DraftCard draft={draft} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Drafts;
