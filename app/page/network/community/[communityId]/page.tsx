import React from 'react';
import CommunityHeader from "@/components/community/CommunityHeaderDetail";

export default function Community({ params }: { params: { communityId: string } }) {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Communauté</h1>
            <CommunityHeader communityId={params.communityId} />
        </div>
    );
}