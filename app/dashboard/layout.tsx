import type React from "react"
import type { Metadata } from "next"
import { AdminLayoutProvider } from "@/components/admin/admin-layout-provider"
import { auth } from "../api/auth/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard - Portfolio",
  description: "Admin panel for managing portfolio content",
  robots: "noindex, nofollow",
}


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');
  return <AdminLayoutProvider userId={session.user?.id}>{children}</AdminLayoutProvider>
}