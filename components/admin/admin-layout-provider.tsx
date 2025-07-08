"use client"

import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"

export function AdminLayoutProvider({ children, userId }: { children: React.ReactNode, userId?:string }) {

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar userId={userId}/>
      <div className="lg:pl-64">
        <AdminHeader userId={userId} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
