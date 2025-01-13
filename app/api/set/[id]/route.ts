import { db } from "@/db";
import { sets } from "@/schema/set";
import { eq } from "drizzle-orm";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

 
  const set = await db.select().from(sets).where(eq(sets.id, id));

  return new Response(JSON.stringify(set), { status: 200 });
}
