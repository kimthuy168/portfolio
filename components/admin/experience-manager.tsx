"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, CalendarDays, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Experience, NewExperience } from "@/lib/db/schema"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"

type ExperienceFormData = NewExperience & { userId: string }

export function ExperienceManager({ userId }: { userId: string }) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<ExperienceFormData>({
    company: "",
    position: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    current: false,
    published: true,
    userId,
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`/api/experience/${userId}`)
      if (!response.ok) throw new Error("Failed to fetch experiences")
      const data = await response.json()
      setExperiences(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const experienceData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.current || !formData.endDate ? null : new Date(formData.endDate)
    }

    try {
      const url = editingExperience ? `/api/experience/${editingExperience.id}` : "/api/experience"
      const method = editingExperience ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experienceData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Experience ${editingExperience ? "updated" : "created"} successfully`,
        })
        fetchExperiences()
        resetForm()
        setIsDialogOpen(false)
      } else {
        throw new Error("Failed to save experience")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setFormData({
      company: experience.company,
      position: experience.position,
      description: experience.description,
      startDate: experience?.startDate ? new Date(experience?.startDate) : new Date(),
      endDate: experience?.endDate ? new Date(experience?.endDate) : new Date(),
      current: experience.current || false,
      published: experience.published || true,
      userId: experience.userId || userId,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return

    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Experience deleted successfully",
        })
        fetchExperiences()
      } else {
        throw new Error("Failed to delete experience")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      current: false,
      published: true,
      userId,
    })
    setEditingExperience(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Present"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  if (loading) {
    return <div>Loading experiences...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Experience Management</h2>
          <p className="text-gray-600">Manage your work experience and career timeline</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingExperience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
              <DialogDescription>
                {editingExperience ? "Update experience details" : "Add a new work experience to your portfolio"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData?.startDate as any}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData?.endDate as any}
                    onChange={handleChange}
                    disabled={!!formData.current}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="current"
                    checked={!!formData.current}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, current: checked }))}
                  />
                  <Label htmlFor="current">Current Position</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData?.published!}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingExperience ? "Update" : "Create"} Experience</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {experiences.map((experience) => (
          <Card key={experience.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {experience.position}
                    {experience.current && <Badge variant="secondary">Current</Badge>}
                    {!experience.published && <Badge variant="outline">Draft</Badge>}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-blue-600">{experience.company}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(experience)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(experience.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                </div>
                <p className="text-gray-700">{experience.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}