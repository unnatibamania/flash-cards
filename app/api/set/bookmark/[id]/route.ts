import { db } from "@/db";
import { sets } from "@/schema/set";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = (await params).id;
    const set = await db.select().from(sets).where(eq(sets.id, id));

    if (!set) {
      return new Response("Set not found", { status: 404 });
    }

    const updatedSet = await db
      .update(sets)
      .set({
        is_bookmarked: !set[0].is_bookmarked,
      })
      .where(eq(sets.id, id))
      .returning();

    return Response.json(updatedSet[0]);
  } catch (error) {
    console.error(error);
    return new Response("Failed to update bookmark", { status: 500 });
  }
} 