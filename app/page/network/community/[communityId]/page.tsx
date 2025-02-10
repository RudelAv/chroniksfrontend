import React from 'react';
import CommunityHeader from '@/components/community/CommunityHeaderDetail';
import EventsCalendar from '@/components/community/eventCommunity';
import PostCommunityList from '@/components/post/PostCommunityList';
import CommunityPostModal from '@/components/community/communityPostModal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { redirect } from 'next/navigation';

export default async function Community({ params }: { params: { communityId: string } }) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        redirect('/page/login?callbackUrl=/page/network/community/' + params.communityId);
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Communauté</h1>
            <CommunityHeader communityId={params.communityId} />
            
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6">Événements</h2>
                <EventsCalendar communityId={params.communityId} />
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Articles</h2>
                    <CommunityPostModal communityId={params.communityId} />
                </div>
                <div className="">
                    <PostCommunityList communityId={params.communityId} accessToken={session?.user.accessToken} />
                </div>
            </div>
        </div>
    );
}