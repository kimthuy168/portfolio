"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { SocialAccountMultiSelect } from "./social-account-selete"
import { HeroSection } from "@/lib/db/schema"


type HeroFormData = Omit<HeroSection, "id"> & { id?: string }

export function HeroManager({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [heroes, setHeroes] = useState<HeroSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState<HeroFormData>({
    socialAccountId:  [] as string[],
    title: "",
    subtitle: "",
    description: "",
    email: "",
    cvUrl: "",
    published: true,
    userId,
    createdAt: new Date()
  })

  useEffect(() => {
    fetchHeroes()
  }, [])

  const fetchHeroes = async () => {
    try {
      const res = await fetch(`/api/hero/${userId}`)
      const data = await res.json()
      setHeroes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hero data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      socialAccountId:  [] as string[],
      title: "",
      subtitle: "",
      description: "",
      email: "",
      cvUrl: "",
      published: true,
      userId,
      createdAt: new Date(),
    })
    setEditingHero(null)
  }

  const handleEdit = (hero: HeroSection) => {
    setEditingHero(hero)
    setFormData(hero)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero section?")) return

    try {
      const res = await fetch(`/api/hero/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Delete failed")

      toast({ title: "Success", description: "Hero section deleted" })
      fetchHeroes()
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingHero ? `/api/hero/${editingHero.id}` : "/api/hero"
      const method = editingHero ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save hero section")

      toast({
        title: "Success",
        description: `Hero ${editingHero ? "updated" : "created"} successfully`,
      })

      fetchHeroes()
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading hero sections...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hero Section Management</h2>
          <p className="text-gray-600">Manage the introduction section of your portfolio</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Hero
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingHero ? "Edit Hero" : "Add Hero"}</DialogTitle>
              <DialogDescription>
                {editingHero ? "Update your hero section" : "Create a new hero section"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
              <Input name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Subtitle" required />
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
              <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required />
              <Input name="cvUrl" value={formData.cvUrl ?? ""} onChange={handleChange} placeholder="CV URL (optional)" />
              <SocialAccountMultiSelect
                userId={userId}
                selectedIds={formData.socialAccountId ?? []}
                onChange={(id) => setFormData((prev) => ({ ...prev, socialAccountId: id }))}
              />
              <div className="flex items-center gap-2">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={formData?.published!}
                  onCheckedChange={(v) => setFormData((prev) => ({ ...prev, published: v }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingHero ? "Update" : "Create"} Hero</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {heroes.map((hero) => (
          <div key={hero.id} className="border p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold">{hero.title}</h3>
            <p className="text-gray-600">{hero.subtitle}</p>
            <p className="mt-2">{hero.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              <span>Email: {hero.email}</span><br />

              {hero.cvUrl && <span>CV: <a href={hero.cvUrl} target="_blank" className="text-blue-600 underline">{hero.cvUrl}</a></span>}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(hero)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(hero.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
