import { db } from "@/db";
import { sets } from "@/schema/set";

import { randomUUID } from "crypto";

import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { title, description, tags, is_draft, is_public } =
    await request.json();

  try {
    const user = await currentUser();

    console.log({user: user?.id})

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
