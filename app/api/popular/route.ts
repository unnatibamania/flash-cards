import { db } from "@/db";
import { sets } from "@/schema/set";
import { eq,  } from "drizzle-orm";


export async function GET() {

    const setsList = await db.select().from(sets).where(eq(sets.is_draft, false));

    return new Response(JSON.stringify(setsList), { status: 200 });
}