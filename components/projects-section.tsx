'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/lib/db/schema"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function ProjectsSection({ userId }: { userId: string }) {
  const { data: projects, isLoading } = useSWR<Project[]>(`/api/projects/${userId}`, fetcher)

  const SectionHeader = (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Here are some of my recent projects that showcase my skills and experience in full-stack development.
      </p>
    </div>
  )

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {SectionHeader}
          <p className="text-center text-gray-500">Loading projects...</p>
        </div>
      </section>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {SectionHeader}
          <p className="text-center text-gray-500">No projects available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {SectionHeader}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={project.imageUrl || "/placeholder.svg?height=200&width=400"}
                  alt={project.title || "Project image"}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {project.title}
                  {project.featured && <Badge variant="secondary">Featured</Badge>}
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>

              <CardContent>
                {project?.technologies!.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project?.technologies!.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {project.demoUrl && (
                    <Button size="sm" asChild>
                      <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Demo
                      </Link>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
