"use client";

import { Post } from "@/app/api/interfaces/post";
import { useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import ApiPost from "@/app/api/posts/post";
import PostCard from "./PostCard";
import { PostListSkeleton } from "./PostSkeleton";

export default function SavedPostList() {
    const { data: session } = useSession();
    const [Savedposts, setSavedPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await ApiPost.getSavedPosts(session?.user.accessToken);
                setSavedPosts(response.savedPosts);
            } catch (err) {
                setError("Impossible de charger les articles");
                console.error("Erreur lors du chargement des posts:", err);
            } finally {
                setIsLoading(false);
            }
        };
        
        if (session?.user.accessToken) {
            fetchPosts();
        }
    }, [session?.user.accessToken]);

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
            {Savedposts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    )
}