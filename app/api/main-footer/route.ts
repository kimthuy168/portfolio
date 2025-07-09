import { createMainFooter } from "@/lib/db/queries"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createMainFooter(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating contact message:", error)
    return NextResponse.json({ error: "Failed to create contact message" }, { status: 500 })
  }
}
