import { ProfileAccount } from "@/components/admin";


export default async function ProjectsPage(props: { params: Promise<{ id: string }>}) {
   const params = await props.params;
   const { id } = params;
  return <ProfileAccount userId={id}/>
}