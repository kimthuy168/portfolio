import { SocialAccountManager } from "@/components/admin";

const SocialAccountPage = async (props: { params: Promise<{ id: string }>}) => {
  const params = await props.params;
  const { id } = params;
  return (
    <div className="">
      <SocialAccountManager userId={id}/>
    </div>
  )
}

export default SocialAccountPage
