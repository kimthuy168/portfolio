import { type NextRequest, NextResponse } from "next/server"
import {  createSkill } from "@/lib/db/queries"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createSkill(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating contact message:", error)
    return NextResponse.json({ error: "Failed to create contact message" }, { status: 500 })
  }
}
