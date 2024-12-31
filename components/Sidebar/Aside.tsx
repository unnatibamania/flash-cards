"use client";
import { usePathname } from "next/navigation";

import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  Settings,
  LucideDraftingCompass,
  Notebook,
  // Stars,
  // Send,
  Zap,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

export const Aside = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: setList } = useQuery({
    queryKey: ["sets"],
    queryFn: () => axios.get("/api/set").then((res) => res.data),
  });

  const { data: draftSets } = useQuery({
    queryKey: ["drafts"],
    queryFn: () => axios.get("/api/draft").then((res) => res.data),
  });

  return (
    <aside className="flex flex-col border min-w-56 justify-between">
      <div className="flex flex-col items-center gap-4 p-2">
        <h1 className="text-2xl font-bold p-2">Sheep Ed App</h1>

        <section className="flex flex-col gap-1 w-full">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className={cn(
              "w-full justify-start",
              pathname === "/" && "bg-muted"
            )}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/drafts")}
            className={cn(
              "w-full justify-between",
              pathname === "/drafts" && "bg-muted"
            )}
          >
            <div className="flex items-center gap-1">
              <LucideDraftingCompass className="w-4 h-4" />
              <span>Drafts</span>
            </div>

            {draftSets?.length > 0 ? (
              <p className="">{draftSets?.length}</p>
            ) : null}
          </Button>

          <Button
            onClick={() => router.push("/my-sets")}
            variant="ghost"
            className={cn(
              "w-full  justify-between",
              pathname === "/my-sets" && "bg-muted"
            )}
          >
            <div className="flex items-center gap-1">
              <Notebook className="w-4 h-4" />
              <span>My sets</span>
            </div>

            {setList?.length > 0 ? <p className="">{setList?.length}</p> : null}
          </Button>
        </section>
      </div>

      <div className="flex flex-col p-4 gap-4">
        <Button
          onClick={() => router.push("/settings")}
          variant="ghost"
          className="w-full justify-start"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Button>

        <Button className="w-full justify-start">
          <Zap className="w-4 h-4" />
          Upgrade account
        </Button>
      </div>
    </aside>
  );
};
