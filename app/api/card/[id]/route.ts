import { db } from "@/db";
import { cards } from "@/schema/card";
import { eq } from "drizzle-orm";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const cardsList = await db.select().from(cards).where(eq(cards.set_id, id));

  return new Response(JSON.stringify(cardsList), { status: 200 });
}
