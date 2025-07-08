import { ProjectsManager } from "@/components/admin";


export default async function SettingPage(props: { params: Promise<{ id: string }>}) {
   const params = await props.params;
   const { id } = params;
  return <ProjectsManager userId={id}/>
}