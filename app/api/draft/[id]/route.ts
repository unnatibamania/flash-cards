import { db } from "@/db";
import { sets } from "@/schema/set";
import { cards } from "@/schema/card";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = (await params).id;
    
    const draftCards = await db
      .delete(cards)
      .where(eq(cards.set_id, id))
      .returning();

    // Then delete the set
    const draft = await db.delete(sets).where(eq(sets.id, id)).returning();

    return { draft, draftCards };
  } catch (error) {
    console.error(error);
    return new Response("Failed to delerte draft", { status: 500 });
  }
}
