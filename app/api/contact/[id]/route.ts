import { type NextRequest, NextResponse } from "next/server"
import { updateContactReadStatus, deleteContact } from "@/lib/db/queries"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const updated = await updateContactReadStatus(id, body.read)

    if (!updated) {
      return NextResponse.json({ error: "Contact message not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating contact message:", error)
    return NextResponse.json({ error: "Failed to update contact message" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const deleted = await deleteContact(id)

    if (!deleted) {
      return NextResponse.json({ error: "Contact message not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact message deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact message:", error)
    return NextResponse.json({ error: "Failed to delete contact message" }, { status: 500 })
  }
}
