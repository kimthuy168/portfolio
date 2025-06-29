import type React from "react"
import type { Metadata } from "next"
import { AdminLayoutProvider } from "@/components/admin/admin-layout-provider"

export const metadata: Metadata = {
  title: "Admin Dashboard - Portfolio",
  description: "Admin panel for managing portfolio content",
  robots: "noindex, nofollow",
}


export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutProvider>{children}</AdminLayoutProvider>
}