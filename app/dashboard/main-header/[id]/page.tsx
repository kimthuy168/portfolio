import { MainHeaderManager } from "@/components/admin";

const MainHeaderPage = async (props: { params: Promise<{ id: string }>}) => {
  const params = await props.params;
  const { id } = params;
  return (
    <div className="">
      <MainHeaderManager userId={id}/>
    </div>
  )
}

export default MainHeaderPage
