"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Code, Server, Database, Cloud } from "lucide-react"
import type { Skill } from "@/lib/db/schema"
import useSWR from "swr"

const categoryIcons = {
  Frontend: Code,
  Backend: Server,
  Database: Database,
  Cloud: Cloud,
  DevOps: Cloud,
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SkillsSection({userId}:{userId:string}) {
  const { data: skills, isLoading} = useSWR<Skill[]>('/api/skills?published=true', fetcher);
 

  const groupedSkills = skills?.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Skills & Technologies</h2>
            <p className="text-gray-600">Loading skills...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            My technical expertise spans across various technologies and frameworks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(groupedSkills!).map(([category, categorySkills]) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Code

            return (
              <Card key={category}>
                <CardHeader className="text-center">
                  <IconComponent className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-500">{skill.level}/5</span>
                      </div>
                      <Progress value={(skill.level / 5) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
