"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { CalendarDays } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Experience } from "@/lib/db/schema"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ExperienceSection({ userId }: { userId: string }) {
  const { data: experiences, isLoading } = useSWR<Experience[]>(`/api/experience/${userId}`, fetcher)

  const formatDate = (date: string | null) => {
    if (!date) return "Present"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <p className="text-gray-600">Loading experience...</p>
      )
    }

    if (!experiences || experiences.length === 0) {
      return <p className="text-gray-500 text-center">No work experience available at the moment.</p>
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {experiences.map((exp) => (
          <Card key={exp.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">{exp.position}</CardTitle>
                  <CardDescription className="text-lg font-medium text-blue-600">
                    {exp.company}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0 text-sm text-gray-500">
                  {exp.current && <Badge variant="secondary">Current</Badge>}
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    {formatDate(exp?.startDate.toDateString())} - {formatDate(exp?.endDate?.toDateString() ?? null)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{exp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }, [experiences, isLoading])

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Work Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            My professional journey and the companies I&apos;ve had the pleasure to work with.
          </p>
        </div>
        {content}
      </div>
    </section>
  )
}
