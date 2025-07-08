"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function MainHeaderManager({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    published: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/main-header", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      })
      if (!response.ok) throw new Error("Failed to create main header")
      toast({ title: "Success", description: "Main header created." })
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="userName" value={formData.userName} onChange={handleChange} placeholder="User Name" required />
      <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <div className="flex items-center gap-2">
        <Label htmlFor="published">Published</Label>
        <Switch checked={formData.published} onCheckedChange={(v) => setFormData({ ...formData, published: v })} />
      </div>
      <Button type="submit">Save Main Header</Button>
    </form>
  )
}