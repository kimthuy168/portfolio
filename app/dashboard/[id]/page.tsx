import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
   const { id } = params;
  return <AdminDashboard userId={id}/>
}
