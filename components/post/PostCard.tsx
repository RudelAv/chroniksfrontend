import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    imagePreview?: string;
    tags: string[];
    createdAt: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/page/post/${post._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        {post.imagePreview && (
          <div className="aspect-video relative overflow-hidden">
            <img
              src={post.imagePreview}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardHeader>
          <h2 className="text-xl font-semibold line-clamp-2">{post.title}</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">
            {post.content.replace(/[#*`]/g, '')}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: fr
            })}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
} 