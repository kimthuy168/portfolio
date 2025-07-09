import { getHeroSectionsByUserId } from "@/lib/db/queries";
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: Request,context: { params: Promise<{ id: string }>}) {
  try {
    const { id } = await context.params;
    if (!id) {
        return new Response('id is required', { status: 400 });
    }
    const result = await getHeroSectionsByUserId(id);
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 })
  }
}
