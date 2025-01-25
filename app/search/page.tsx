'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import ApiPost from '@/app/api/posts/post';
import PostCard from '@/components/post/PostCard';
import { useSession } from 'next-auth/react';
import { Post } from '@/app/api/interfaces/post';
import { Skeleton } from '@/components/ui/skeleton';

const SearchSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
                {/* Image skeleton */}
                <Skeleton className="w-full h-48 rounded-t-lg" />
                
                {/* Title skeleton */}
                <div className="p-4 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    
                    {/* Tags skeleton */}
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    
                    {/* Content skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default function SearchPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Stocker les paramètres initiaux dans une référence
    const initialParams = useRef({
        query: searchParams.get('q') || '',
        tags: searchParams.get('tags')?.split(',').filter(Boolean) || []
    });

    if (!session?.user?.accessToken) {
        redirect('/page/login?callbackUrl=/search?q=' + initialParams.current.query);
    }

    useEffect(() => {
        if (!session?.user?.accessToken) {
          return;
        }
        const fetchSearchResults = async () => {
            if (!session?.user?.accessToken) return;
            
            try {
                setLoading(true);
                const results = await ApiPost.searchPost(
                    session.user.accessToken, 
                    initialParams.current.query, 
                    initialParams.current.tags
                );
                setPosts(results);
            } catch (error) {
                console.error('Erreur lors de la recherche:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [session?.user?.accessToken]);


    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">
                Résultats de recherche pour : {initialParams.current.query}
                {initialParams.current.tags.length > 0 && 
                    ` et tags: ${initialParams.current.tags.join(', ')}`}
            </h1>
            
            {loading ? (
                <SearchSkeleton />
            ) : posts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    Aucun résultat trouvé
                </div>
            )}
        </div>
    );
} 