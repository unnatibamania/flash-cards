import { db } from "@/db";
import { sets } from "@/schema/set";
import { eq } from "drizzle-orm";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,

  {params}: {params: {id: string}}
) {
  const {id} = await params;

 
  const set = await db.select().from(sets).where(eq(sets.id, id));

  console.log({set});
  return new Response(JSON.stringify(set), { status: 200 });
}
