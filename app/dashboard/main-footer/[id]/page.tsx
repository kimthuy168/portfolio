import { MainFooterManager } from "@/components/admin";

const MainFooterPage = async (props: { params: Promise<{ id: string }>}) => {
  const params = await props.params;
  const { id } = params;
  return (
    <div className="">
      <MainFooterManager userId={id}/>
    </div>
  )
}

export default MainFooterPage
