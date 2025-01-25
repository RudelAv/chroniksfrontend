"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ApiPost from "@/app/api/posts/post";
import MDEditor from "@uiw/react-md-editor";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  content: string;
  imagePreview?: string;
  author: string; // ID de l'auteur
  tags: string[];
  createdAt: string;
}

interface Author {
  _id: string;
  name: string;
  image?: string;
}

export default function PostContent({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndAuthor = async () => {
      try {
        const postResponse = await ApiPost.getPost(session?.user?.accessToken, postId);
        setPost(postResponse);

        // Une fois qu'on a le post, on récupère les infos de l'auteur
        const authorResponse = await ApiPost.getPostAuthor(session?.user?.accessToken, postId);
        setAuthor(authorResponse);
      } catch (error) {
        console.error("Erreur lors du chargement du post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.accessToken) {
      fetchPostAndAuthor();
    }
  }, [postId, session?.user?.accessToken]);

  if (isLoading) {
    return null;
  }
  if (!post || !author) return <div>Post non trouvé</div>;

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        
        <div className="flex items-center space-x-4">
          <Avatar>
            <Link href={`/page/autor/${author._id}`}>
              <AvatarImage src={author.image} />
            </Link>
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { 
                addSuffix: true,
                locale: fr 
              })}
            </p>
          </div>
        </div>

        {post.imagePreview && (
          <img 
            src={post.imagePreview} 
            alt={post.title}
            className="w-full rounded-lg object-cover max-h-[400px]"
          />
        )}

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDEditor.Markdown source={post.content} />
      </div>
    </article>
  );
} 