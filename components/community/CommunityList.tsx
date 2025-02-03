"use client"

import { useSession } from "next-auth/react";
import { CommunityCard } from "./communityCard";
import ApiCommunity from "@/app/api/community/community";
import { logError } from "@/lib/utils";
import { useState, useEffect } from "react";

export function CommunityList() {

    const { data: session } = useSession();
    const [communities, setCommunities] = useState<Community[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                if (session?.user.accessToken) {
                    const response = await ApiCommunity.getCommunities(session?.user.accessToken);
                    setCommunities(response);
                }
            } catch (error) {
                logError(error);
                setError("Impossible de charger les communautés");
            }
        }

        fetchCommunities();
    }, [session?.user.accessToken]);

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {error && <div className="text-red-500">{error}</div>}
                {communities.map((community) => (
                    <CommunityCard key={community._id} community={community} accessToken={session?.user.accessToken} />
                ))}
            </div>
        </div>
    )
}