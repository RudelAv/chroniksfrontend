"use client"

import ApiCommunity from "@/app/api/community/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { logError } from "@/lib/utils";
import { useSession } from "next-auth/react"
import { Suspense, useEffect, useState } from "react";
import { PostListSkeleton } from "./PostSkeleton";
import PostCard from "./PostCard";
import { Post } from "@/app/api/interfaces/post";

interface PostCommunityListProps {
    communityId: string,
    accessToken?: string
}

export default function PostCommunityList({ communityId, accessToken }: PostCommunityListProps) {
    const [CommunityPosts, setCommunityPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchCommunityPosts = async () => {
            try {
                if (accessToken) {
                    const response = await ApiCommunity.getCommunityPosts(accessToken, communityId);
                    setCommunityPosts(response.posts);
                }
            } catch (error) {
                logError(error);
                setError("Impossible de charger les posts");
            } finally {
                setIsLoading(false);
            }
        }

        fetchCommunityPosts();
    }, [accessToken]);

    if (isLoading) return <Suspense fallback={<PostListSkeleton />}></Suspense>;
    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                {error}
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CommunityPosts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    )
}