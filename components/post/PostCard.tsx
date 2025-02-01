import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Import ajouté
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    imagePreview?: string;
    tags: string[];
    createdAt: string;
    author: { 
      name: string;
      image?: string;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    router.push(`/search?tags=${encodeURIComponent(tag)}`);
  };

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
          <div className="flex items-center gap-3 mb-2"> {/* Nouvelle section avatar */}
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.image} />
              <AvatarFallback>
                {post.author.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
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
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags?.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
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