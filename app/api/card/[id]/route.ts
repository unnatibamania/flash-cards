import { db } from "@/db";
import { cards } from "@/schema/card";
import { eq } from "drizzle-orm";


export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
  
    console.log({params})
    
    // const { id } = params;
  
    const cardsList = await db
      .select()
      .from(cards)
      .where(eq(cards.set_id, params.id));

      console.log({cardsList})
  
    return new Response(JSON.stringify(cardsList), { status: 200 });
  }
  