import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { AutorProfile } from '@/components/profile/autorProfile';

export const dynamic = 'force-dynamic';

const AutorPage = async ({ params }: { params: { userId: string } }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/page/login?callbackUrl=/page/autor');
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <AutorProfile session={session} userId={params.userId} />
        </div>
    )
}

export default AutorPage;