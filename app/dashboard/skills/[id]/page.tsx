import { SkillsManager } from "@/components/admin/skills-manager"

const SkillsPage = async (props: { params: Promise<{ id: string }>}) => {
  const params = await props.params;
  const { id } = params;
  return (
    <div className="">
      <SkillsManager userId={id}/>
    </div>
  )
}

export default SkillsPage
