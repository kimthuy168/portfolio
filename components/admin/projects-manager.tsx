"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ExternalLink, Github } from "lucide-react"
import type { NewProject, Project } from "@/lib/db/schema"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

type ProjectFormData = Omit<NewProject, "technologies"> & {
  technologies: string
}
export function ProjectsManager({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<ProjectFormData>({
  userId: userId,
  title: "",
  description: "",
  longDescription: "",
  imageUrl: "",
  demoUrl: "",
  githubUrl: "",
  technologies: "",
  featured: false,
  published: true,
});

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/projects/${userId}`)
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const projectData = {
      ...formData,
      userId: userId,
      technologies: formData.technologies.split(",").map((tech) => tech.trim()),
    }

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects"
      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Project ${editingProject ? "updated" : "created"} successfully`,
        })
        fetchProjects()
        resetForm()
        setIsDialogOpen(false)
      } else {
        throw new Error("Failed to save project")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      userId: userId,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      imageUrl: project.imageUrl || "",
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      technologies: project.technologies?.join(", ") ?? "",
      featured: project.featured || false,
      published: project.published || true,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        })
        fetchProjects()
      } else {
        throw new Error("Failed to delete project")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      userId: '',
      title: "",
      description: "",
      longDescription: "",
      imageUrl: "",
      demoUrl: "",
      githubUrl: "",
      technologies: "",
      featured: false,
      published: true,
    })
    setEditingProject(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Projects Management</h2>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                {editingProject
                  ? "Update project details"
                  : "Create a new project for your portfolio"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" value={formData?.imageUrl!} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData?.longDescription!}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input id="demoUrl" name="demoUrl" value={formData?.demoUrl!} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input id="githubUrl" name="githubUrl" value={formData?.githubUrl!} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Next.js, TypeScript"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData?.featured!}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, featured: checked }))
                    }
                  />
                  <Label htmlFor="featured">Featured</Label>
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingProject ? "Update" : "Create"} Project</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {project.title}
                    {project.featured && <Badge variant="secondary">Featured</Badge>}
                    {!project.published && <Badge variant="outline">Draft</Badge>}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-4">
                  {project.demoUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Demo
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
