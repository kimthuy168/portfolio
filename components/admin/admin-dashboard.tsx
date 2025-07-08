"use client"

import { useState } from "react"
import { LogOut, BarChart3, FolderOpen, Code, Briefcase, Mail, UserCircle, Layout, Layers2, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { signOut } from "next-auth/react"
import { ContactManager, ExperienceManager, HeroManager, MainFooterManager, MainHeaderManager, ProjectsManager, SkillsManager, SocialAccountManager } from "@/components/admin"

export function AdminDashboard({userId}:{userId?: string}) {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut({redirectTo: '/',})
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your portfolio content</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="mainHeader" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Main Header
            </TabsTrigger>
            <TabsTrigger value="mainFooter" className="flex items-center gap-2">
              <Layers2 className="h-4 w-4" />
              Main Footer
            </TabsTrigger>
            <TabsTrigger value="socialAccounts" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social Accounts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Skills</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Across 4 categories</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Experience</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Companies worked with</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">5 unread</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Welcome to your Portfolio Admin</CardTitle>
                <CardDescription>
                  Manage your portfolio content from this dashboard. You can add, edit, and delete projects, skills,
                  experience, and view contact messages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Quick Actions:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                      <li>Add new projects to showcase your work</li>
                      <li>Update your skills and expertise levels</li>
                      <li>Manage your work experience timeline</li>
                      <li>Respond to contact form submissions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManager userId={userId ?? ''}/>
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager userId={userId ?? ''}/>
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceManager userId={userId ?? ''}/>
          </TabsContent>

          <TabsContent value="contact">
            <ContactManager userId={userId ?? ''}/>
          </TabsContent>

          <TabsContent value="hero">
            <HeroManager userId={userId ?? ""} />
          </TabsContent>

          <TabsContent value="mainHeader">
            <MainHeaderManager userId={userId ?? ""} />
          </TabsContent>

          <TabsContent value="mainFooter">
            <MainFooterManager userId={userId ?? ""} />
          </TabsContent>

          <TabsContent value="socialAccounts">
            <SocialAccountManager userId={userId ?? ""} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
