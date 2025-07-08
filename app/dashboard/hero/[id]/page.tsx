import { HeroManager } from "@/components/admin"

const HeroPage = async (props: { params: Promise<{ id: string }>}) => {
  const params = await props.params;
  const { id } = params;
  return (
    <div className="">
      <HeroManager  userId={id}/>
    </div>
  )
}

export default HeroPage
