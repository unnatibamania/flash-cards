import { db } from "@/db";
import { cards } from "@/schema/card";

// import { eq } from "drizzle-orm";

import { randomUUID } from "crypto";

import { CardData } from "@/types/card";

import { currentUser } from "@clerk/nextjs/server";


export async function POST(request: Request) {
    const { set_id, cards_list } = await request.json();

    const user = await currentUser();

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const cardListToReturn = await db
      .insert(cards)
      .values(
        cards_list.map((card: CardData, index: number) => ({
          answer: card.answer,
          question: card.question,
          tags: card.tags,
          set_id,
          order: index,
          user_id: user.id,
          created_at: new Date(),
          updated_at: new Date(),
          id: randomUUID(),
        }))
      )
      .returning();

      return new Response(JSON.stringify(cardListToReturn), { status: 200 });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create cards");
    }
}

