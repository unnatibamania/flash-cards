import { db } from "@/db";
import { sets } from "@/schema/set";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

import { currentUser } from "@clerk/nextjs/server";


export async function POST(request: Request) {
  const { title, description, tags, is_draft, is_public } =
    await request.json();

  try {
    const user = await currentUser();

  
    if (!user) {
      throw new Error("User not found");
    }

    const newSet = await db
      .insert(sets)
      .values({
        title: title.length > 0 ? title : "Untitled",
        description,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
        is_draft: is_draft,
        is_public: is_public,
        id: randomUUID(),
        tags,
    })
    .returning();

    console.log({newSet})

    return new Response(JSON.stringify(newSet), { status: 200 });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create set");
  }
}


export async function GET() {

  try {
    
    const user = await currentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const setList = await db.select().from(sets).where(and(eq(sets.is_draft, false), eq(sets.user_id, user.id)));

    return new Response(JSON.stringify(setList), { status: 200 });

  } catch (error) {
    console.error(error);
    throw new Error("Failed to get sets");
  }

}