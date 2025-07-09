import { type NextRequest, NextResponse } from "next/server"
import {  createExperience } from "@/lib/db/queries"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createExperience(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}
