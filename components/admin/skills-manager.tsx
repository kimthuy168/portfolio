"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Plus, Edit, Trash2, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { NewSkill, Skill } from "@/lib/db/schema"
import { CategoriesJob } from "@/lib/utils"



export function SkillsManager({ userId }: { userId: string }) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<NewSkill>({
    name: "",
    category: "",
    level: 1,
    icon: "",
    published: true,
    userId,
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch(`/api/skills/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch skills")
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills"
      const method = editingSkill ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Skill ${editingSkill ? "updated" : "created"} successfully`,
        })
        fetchSkills()
        resetForm()
        setIsDialogOpen(false)
      } else {
        throw new Error("Failed to save skill")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || "",
      published: skill.published || true,
      userId: skill.userId || userId, // fallback to current user
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Skill deleted successfully",
        })
        fetchSkills()
      } else {
        throw new Error("Failed to delete skill")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      level: 1,
      icon: "",
      published: true,
      userId,
    })
    setEditingSkill(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? Number(value) : value,
    }))
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) return <div>Loading skills...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Skills Management</h2>
          <p className="text-gray-600">Manage your technical skills</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
              <DialogDescription>
                {editingSkill ? "Update skill details" : "Add a new skill to your portfolio"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    {CategoriesJob.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="level">Skill Level (1–5)</Label>
                <Input
                  id="level"
                  name="level"
                  type="number"
                  min={1}
                  max={5}
                  value={formData.level}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input id="icon" name="icon" value={formData?.icon!} onChange={handleChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData?.published!}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, published: checked }))
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingSkill ? "Update" : "Create"} Skill</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => {
          const categoryInfo = CategoriesJob.find((c) => c.value === category)
          const IconComponent = categoryInfo?.icon || Code

          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {category}
                  <Badge variant="secondary">{categorySkills.length}</Badge>
                </CardTitle>
                <CardDescription>Skills in {category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          {!skill.published && <Badge variant="outline">Draft</Badge>}
                        </div>
                        <div className="text-sm text-gray-500">Level: {skill.level}/5</div>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(skill)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(skill.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
