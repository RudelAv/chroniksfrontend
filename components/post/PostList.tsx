"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ApiPost from "@/app/api/posts/post";
import PostCard from "./PostCard";

interface Post {
  _id: string;
  title: string;
  content: string;
  imagePreview?: string;
  author: string;
  tags: string[];
  createdAt: string;
}

export default function PostList() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await ApiPost.getPosts(session?.user?.accessToken);
        // Trier les posts du plus récent au plus ancien
        const sortedPosts = response.sort((a: Post, b: Post) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Erreur lors du chargement des posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.accessToken) {
      fetchPosts();
    }
  }, [session?.user?.accessToken]);

  if (isLoading) return null;
  if (!posts.length) return <div>Aucun article disponible</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
} 