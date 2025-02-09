import React from 'react';
import CommunityHeader from '@/components/community/CommunityHeaderDetail';
import EventsCalendar from '@/components/community/eventCommunity';

export default function Community({ params }: { params: { communityId: string } }) {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Communauté</h1>
            <CommunityHeader communityId={params.communityId} />
            
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6">Événements</h2>
                <EventsCalendar communityId={params.communityId} />
            </div>
        </div>
    );
}