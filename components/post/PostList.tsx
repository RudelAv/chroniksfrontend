"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PostCard from "./PostCard";
import ApiPost from "@/app/api/posts/post";
import { Post } from "@/app/api/interfaces/post";

export default function PostList() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (session?.user?.accessToken) {
          // Utilisateur connecté : récupérer tous les posts récents
          const response = await ApiPost.getPosts(session.user.accessToken);
          const sortedPosts = response.sort((a: Post, b: Post) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setPosts(sortedPosts);
        } else {
          // Visiteur : récupérer les meilleurs posts
          const bestPosts = await ApiPost.getBestPosts();
          setPosts(bestPosts);
        }

      } catch (err) {
        setError("Impossible de charger les articles");
        console.error("Erreur lors du chargement des posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [session?.user?.accessToken]);

  if (isLoading) return null;
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }
  if (!posts.length) return <div>Aucun article disponible</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
} 