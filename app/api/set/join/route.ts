import { db } from "@/db";
import { sets } from "@/schema/set";
import { eq } from "drizzle-orm";

import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const { setId } = await request.json();

    console.log({
      setId
    })

    const existingSet = await db
      .select()
      .from(sets)
      .where(eq(sets.id, setId))
      .then((rows) => rows[0]);

    if (!existingSet) {
      return new Response("Set not found", { status: 404 });
    }

    const updatedSet = await db
      .update(sets)
      .set({
        users_enrolled: [
          ...existingSet.users_enrolled,
          {
            id: user.id,
            profile_picture: user.imageUrl || "",
          },
        ],
      })
      .where(eq(sets.id, setId))
      .returning();

    return new Response(JSON.stringify(updatedSet), { status: 200 });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create set");
  }
}
