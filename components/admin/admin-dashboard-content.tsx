"use client"

import { useState, useEffect } from "react"
import { ProjectsManager } from "./projects-manager"
import { FolderOpen, Code, Briefcase, Mail, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { SkillsManager } from "./skills-manager"
import { ExperienceManager } from "./experience-manager"
import { ContactManager } from "./contact-manager"

export function AdminDashboardContent() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, experiencesRes, messagesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/experiences"),
          fetch("/api/contact"),
        ])

        const [projects, skills, experiences, messages] = await Promise.all([
          projectsRes.json(),
          skillsRes.json(),
          experiencesRes.json(),
          messagesRes.json(),
        ])

        setStats({
          projects: projects.length || 0,
          skills: skills.length || 0,
          experiences: experiences.length || 0,
          messages: messages.length || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Active projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.skills}</div>
            <p className="text-xs text-muted-foreground">Across multiple categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.experiences}</div>
            <p className="text-xs text-muted-foreground">Work experiences</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
            <p className="text-xs text-muted-foreground">Contact inquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your Portfolio Dashboard</CardTitle>
              <CardDescription>
                Manage your portfolio content, view analytics, and respond to inquiries all in one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Quick Actions:</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Add new projects to showcase your latest work</li>
                    <li>Update your skills and expertise levels</li>
                    <li>Manage your professional experience timeline</li>
                    <li>Respond to contact form submissions</li>
                    <li>Monitor portfolio performance and engagement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsManager />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsManager />
        </TabsContent>

        <TabsContent value="experience">
          <ExperienceManager />
        </TabsContent>

        <TabsContent value="messages">
          <ContactManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
