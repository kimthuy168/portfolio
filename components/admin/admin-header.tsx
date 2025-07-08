"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

import { Bell, LogOut, Settings, User2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import useSWR from "swr"

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AdminHeader({ userId }: {userId?: string}) {
  const [notifications] = useState(3) // Mock notification count
  const router = useRouter();
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR<ProfileData>(
    `/api/profile/${userId}`,
    fetcher
    );
  const handleLogout = async () => {
    try {
      await signOut({ redirectTo: "/" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className=" shadow-sm border-b border-gray-200 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          <div className="flex items-center gap-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="size-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            {/* User Menu */}
          
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={data?.name} />
                    <AvatarFallback>{getInitials(data?.name || "U")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="border  bg-white z-[9999] ">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{data?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{data?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/dashboard/profile/${userId}`)}>
                  <User2Icon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/dashboard/settings/${userId}`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </header>
  )
}
