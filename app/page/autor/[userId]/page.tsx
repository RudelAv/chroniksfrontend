import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { AutorProfile } from '@/components/profile/autorProfile';

export const dynamic = 'force-dynamic';
interface AutorPageProps {
    params: {
      userId: string;
    }
  }

  const AutorPage = async ({ params }: AutorPageProps) => {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      redirect('/page/login?callbackUrl=/page/autor/' + params.userId);
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <AutorProfile session={session} userId={params.userId} />
      </div>
    );
  }

export default AutorPage;