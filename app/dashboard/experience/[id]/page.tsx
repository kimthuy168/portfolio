import { ExperienceManager } from "@/components/admin/";

export default async function ExperiencePage(props: { params: Promise<{ id: string }>}) {
  const params = await props.params;
   const { id } = params;
  return  <ExperienceManager userId={id}/>
}