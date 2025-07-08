"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function HeroManager({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    email: "",
    cvUrl: "",
    published: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      })
      if (!response.ok) throw new Error("Failed to create hero section")
      toast({ title: "Success", description: "Hero section created." })
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <Input name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Subtitle" required />
      <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required />
      <Input name="cvUrl" value={formData.cvUrl} onChange={handleChange} placeholder="CV URL" />
      <div className="flex items-center gap-2">
        <Label htmlFor="published">Published</Label>
        <Switch checked={formData.published} onCheckedChange={(v) => setFormData({ ...formData, published: v })} />
      </div>
      <Button type="submit">Save Hero</Button>
    </form>
  )
}