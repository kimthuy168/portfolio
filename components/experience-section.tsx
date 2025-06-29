"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import type { Experience } from "@/lib/db/schema"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ExperienceSection() {
  const { data: experiences, isLoading} = useSWR<Experience[]>('/api/experiences?published=true', fetcher);


  const formatDate = (date: string | null) => {
    if (!date) return "Present"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Work Experience</h2>
            <p className="text-gray-600">Loading experience...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Work Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            My professional journey and the companies I've had the pleasure to work with.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences?.map((experience) => (
            <Card key={experience.id} className="relative">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-xl">{experience.position}</CardTitle>
                    <CardDescription className="text-lg font-medium text-blue-600">
                      {experience.company}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    {experience.current && <Badge variant="secondary">Current</Badge>}
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {formatDate(experience.startDate.toString())} -{" "}
                      {formatDate(experience.endDate?.toString() || null)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{experience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
