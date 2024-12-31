"use client";

import { SetData } from "@/types/set";
import { SetCard } from "@/components/Cards/SetCard";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

const MySets = () => {
    const { data: setList } = useQuery({
        queryKey: ["sets"],
    queryFn: () => axios.get("/api/set").then((res) => res.data),
  });

  if (setList?.length === 0) {
    return (
      <div className="flex rounded-lg h-full w-full  justify-center items-center flex-col gap-4">
        <div className="flex flex-col text-center">
          <p className="text-2xl font-semibold ">No sets found</p>
          <p className="text-sm max-w-xs text-gray-500">
            Sets are collections of cards that you have created.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">My Sets</h1>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {setList?.map((set: SetData, index: number) => (
         <SetCard set={set} index={index} key={index} />
        ))}
      </div>
    </div>
  );
};

export default MySets;
