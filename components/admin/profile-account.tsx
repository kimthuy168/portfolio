"use client"

import useSWR from "swr"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mail,
  ShieldCheck,
  CalendarDays,
  Github,
  Linkedin,
  Send,
  User2,
} from "lucide-react"

type ProfileData = {
  id: string
  email: string
  name: string
  role: string
  provider: string
  createdAt: string
  socialAccount?: {
    githubAccount?: string
    linkedinAccount?: string
    telegramAccount?: string
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ProfileAccount({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR<ProfileData>(
    `/api/profile/${userId}`,
    fetcher
  )

  if (isLoading) return <div className="text-center py-6 text-muted-foreground">Loading...</div>
  if (!data) return <div className="text-center py-6 text-destructive">No profile data found.</div>

  return (
    <div className="flex my-6 items-center gap-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border dark:border-gray-700">
      <Avatar className="cursor-pointer size-20">
        <AvatarImage src="" alt={data.name || data.email} />
        <AvatarFallback>
          {(data.name || data.email)
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User2 className="size-5 text-blue-500" /> {data.name}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <Mail className="size-4 text-blue-400" />
          {data.email}
        </p>

        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <ShieldCheck className="size-4 text-green-500" />
          <span className="capitalize">{data.role}</span> via{" "}
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {data.provider || "email"}
          </span>
        </p>

        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <CalendarDays className="size-4 text-purple-400" />
          Joined: {new Date(data.createdAt).toLocaleDateString()}
        </p>

        {data.socialAccount && (
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {data.socialAccount.githubAccount && (
              <a
                href={`https://github.com/${data.socialAccount.githubAccount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary transition"
              >
                <Github className="h-4 w-4 text-primary" />
                {data.socialAccount.githubAccount}
              </a>
            )}
            {data.socialAccount.linkedinAccount && (
              <a
                href={`https://linkedin.com/in/${data.socialAccount.linkedinAccount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-sky-500 transition"
              >
                <Linkedin className="h-4 w-4" />
                {data.socialAccount.linkedinAccount}
              </a>
            )}
            {data.socialAccount.telegramAccount && (
              <a
                href={`https://t.me/${data.socialAccount.telegramAccount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
              >
                <Send className="h-4 w-4" />
                {data.socialAccount.telegramAccount}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
