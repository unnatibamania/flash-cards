import { db } from "@/db";
import { sets } from "@/schema/set";
import { eq, and } from "drizzle-orm";

import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const draftSets = await db
      .select()
      .from(sets)
      .where(and(eq(sets.is_draft, true), eq(sets.user_id, user.id)));

    return new Response(JSON.stringify(draftSets), { status: 200 });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get draft sets");
  }
}
