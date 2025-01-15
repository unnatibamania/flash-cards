"use client";

import { useQuery } from "@tanstack/react-query";


import { SetToJoin } from "@/components/Cards/SetToJoin";

import { SetData } from "@/types/set";
import { RecentCard } from "@/components/Cards/RecentCard";

export default function Home() {

  const { data } = useQuery({
    queryKey: ["popular-sets"],
    queryFn: () => fetch("/api/popular").then((res) => res.json()),
  });

  console.log({
    data
  })

  return (
    <div className="flex h-full max-w-6xl gap-6 flex-col p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Recents</h1>
          <p className="text-sm text-gray-400">
            These are the cards which you have preffered last week
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {data?.map((set: SetData, index: number) => (
            <RecentCard set={set} key={index} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Popular cards</h1>
          <p className="text-sm text-gray-400">
            These are the cards which you have preffered last week
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {data?.map((set: SetData, index: number) => (
            <SetToJoin set={set} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
