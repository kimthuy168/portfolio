import { type NextRequest, NextResponse } from "next/server"
import {  createSkill, getAllSkills } from "@/lib/db/queries"

export async function GET() {
  try {
    const result = await getAllSkills()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 })
  }
}

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
