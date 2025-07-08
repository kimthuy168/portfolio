import { ContactManager } from "@/components/admin";

export default async function ProjectsPage(props: { params: Promise<{ id: string }>}) {
   const params = await props.params;
   const { id } = params;
  return <ContactManager userId={id}/>
}