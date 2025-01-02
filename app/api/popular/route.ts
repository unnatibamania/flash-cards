import { db } from "@/db";
import { sets } from "@/schema/set";
import { eq, and, not, sql, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const popularSets = await db
      .select()
      .from(sets)
      .where(
        and(
          not(eq(sets.user_id, user.id)), // Sets not created by the user
          sql`${user.id} != ANY(${sets.users_enrolled})` // User not enrolled in the set
        )
      )
      .orderBy(desc(sets.users_enrolled));

   
    return new Response(JSON.stringify(popularSets), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch popular sets", { status: 500 });
  }
}
