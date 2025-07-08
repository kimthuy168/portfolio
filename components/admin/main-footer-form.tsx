"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function MainFooterManager({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    userName: "",
    descriptionMyself: "",
    email: "",
    phone: "",
    adress: "",
    published: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/main-footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId, phone: parseInt(formData.phone || "0") }),
      })
      if (!response.ok) throw new Error("Failed to create main footer")
      toast({ title: "Success", description: "Main footer created." })
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="userName" value={formData.userName} onChange={handleChange} placeholder="User Name" required />
      <Textarea name="descriptionMyself" value={formData.descriptionMyself} onChange={handleChange} placeholder="About Me" required />
      <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
      <Input name="adress" value={formData.adress} onChange={handleChange} placeholder="Address" required />
      <div className="flex items-center gap-2">
        <Label htmlFor="published">Published</Label>
        <Switch checked={formData.published} onCheckedChange={(v) => setFormData({ ...formData, published: v })} />
      </div>
      <Button type="submit">Save Footer</Button>
    </form>
  )
}