"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function SocialAccountManager({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    githubAccount: "",
    linkedinAccount: "",
    telegramAccount: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      })
      if (!response.ok) throw new Error("Failed to create social account")
      toast({ title: "Success", description: "Social account saved." })
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="githubAccount" value={formData.githubAccount} onChange={handleChange} placeholder="GitHub" />
      <Input name="linkedinAccount" value={formData.linkedinAccount} onChange={handleChange} placeholder="LinkedIn" />
      <Input name="telegramAccount" value={formData.telegramAccount} onChange={handleChange} placeholder="Telegram" />
      <Button type="submit">Save Social Links</Button>
    </form>
  )
}