import CreateCommunityForm from '@/components/community/createCommunityForm'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
export default async function NewCommunityPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/page/login?callbackUrl=/page/network/new');
  }
  return (
    <div className="container mx-auto py-8">
      <CreateCommunityForm />
    </div>
  )
}