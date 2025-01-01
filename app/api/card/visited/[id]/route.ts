import { db } from "@/db";
import { cards } from "@/schema/card";
import { eq } from "drizzle-orm";

import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request, {params}: {params: {id: string}}) {
    const { id } = await params;
  
    try {
      const user = await currentUser();
  
    
      if (!user) {
        throw new Error("User not found");
      }
  
      const card = await db.update(cards).set({
        is_visited: true
      }).where(eq(cards.id, id));
  
      return new Response(JSON.stringify(card), { status: 200 });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create set");
    }
  }