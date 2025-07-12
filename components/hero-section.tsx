"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Download } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

type HeroResponse = {
  title: string
  subtitle: string
  description: string
  cv: string 
  email: string
  githubAccount?: string
  linkedinAccount?: string
  telegramAccount?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function HeroSection({ userId }: { userId: string }) {
  const { data: heroData, error, isLoading } = useSWR<HeroResponse>(
    `/api/hero/${userId}`,
    fetcher
  )

  const title = heroData?.title ?? "Full Stack Developer"
  const subtitle = heroData?.subtitle ?? "Building modern web applications with cutting-edge technologies"
  const description = heroData?.description ?? "Passionate about creating scalable, user-friendly applications using React, Next.js, Node.js, and modern development practices."

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">{subtitle}</p>
          <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">{description}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {heroData?.email && (
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href={`mailto:${heroData.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </Link>
              </Button>
            )}
            {heroData?.cv && (
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                asChild
              >
                <Link href={heroData.cv} target="_blank">
                  <Download className="mr-2 h-5 w-5" />
                  Download CV
                </Link>
              </Button>
            )}
          </div>

          <div className="flex justify-center space-x-6">
            {heroData?.githubAccount && (
              <Link
                href={heroData.githubAccount}
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-8 w-8" />
              </Link>
            )}
            {heroData?.linkedinAccount && (
              <Link
                href={heroData.linkedinAccount}
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-8 w-8" />
              </Link>
            )}
            {heroData?.email && (
              <Link
                href={`mailto:${heroData.email}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-8 w-8" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
