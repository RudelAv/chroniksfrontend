'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ApiPost from '@/app/api/posts/post';
import ApiProfile from '@/app/api/authentification/profile';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile, Bold, Italic, Code } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";

interface User {
    _id: string;
    name: string;
    image: string;
}

interface Comment {
    _id: string;
    user: string; // ID de l'utilisateur
    content: string;
    createdAt: string;
}

interface Post {
    comments: Comment[];
}

interface CommentWithUser extends Omit<Comment, 'user'> {
    user: User;
}

export default function CommentSection({ postId }: { postId: string }) {
    const [comment, setComment] = useState('');
    const [post, setPost] = useState<Post | null>(null);
    const [commentsWithUsers, setCommentsWithUsers] = useState<CommentWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await ApiPost.getPost(session?.user.accessToken, postId);
                setPost(response);

                const commentsWithUserInfo = await Promise.all(
                    response.comments.map(async (comment: Comment) => {
                        try {
                            const userInfo = await ApiProfile.getUserInfo(
                                session?.user.accessToken,
                                comment.user
                            );
                            return {
                                ...comment,
                                user: userInfo
                            };
                        } catch (error) {
                            return {
                                ...comment,
                                user: {
                                    _id: comment.user,
                                    name: "Utilisateur inconnu",
                                    image: ""
                                }
                            };
                        }
                    })
                );

                // Trier les commentaires du plus récent au plus ancien
                const sortedComments = commentsWithUserInfo.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setCommentsWithUsers(sortedComments);
            } catch (error) {
                toast.error("Erreur lors du chargement des commentaires");
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user.accessToken) {
            fetchPost();
        }
    }, [postId, session?.user.accessToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const response = await ApiPost.commentPost(session?.user.accessToken, postId, comment);
            setPost(response);
            
            // Mettre à jour les commentaires avec les informations utilisateur
            const newCommentsWithUsers = await Promise.all(
                response.comments.map(async (comment: Comment) => {
                    try {
                        const userInfo = await ApiProfile.getUserInfo(
                            session?.user.accessToken,
                            comment.user
                        );
                        return {
                            ...comment,
                            user: userInfo
                        };
                    } catch (error) {
                        return {
                            ...comment,
                            user: {
                                _id: comment.user,
                                name: "Utilisateur inconnu",
                                image: ""
                            }
                        };
                    }
                })
            );

            setCommentsWithUsers(newCommentsWithUsers);
            setComment('');
            toast.success("Commentaire ajouté");
        } catch (error) {
            toast.error("Erreur lors de l'ajout du commentaire");
        }
    };

    const insertText = (before: string, after: string = '') => {
        const textarea = document.getElementById('comment-input') as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
        setComment(newText);
    };

    if (isLoading) {
        return <CommentsSkeleton />;
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">
                Commentaires ({commentsWithUsers.length})
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <Textarea
                        id="comment-input"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Écrivez un commentaire..."
                        className="min-h-[100px]"
                    />
                    
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" type="button">
                                    <Smile />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <EmojiPicker 
                                    onEmojiClick={(emoji) => setComment(prev => prev + emoji.emoji)}
                                />
                            </PopoverContent>
                        </Popover>

                        <Button 
                            variant="ghost" 
                            size="sm" 
                            type="button"
                            onClick={() => insertText('**', '**')}
                        >
                            <Bold />
                        </Button>

                        <Button 
                            variant="ghost" 
                            size="sm" 
                            type="button"
                            onClick={() => insertText('*', '*')}
                        >
                            <Italic />
                        </Button>

                        <Button 
                            variant="ghost" 
                            size="sm" 
                            type="button"
                            onClick={() => insertText('`', '`')}
                        >
                            <Code />
                        </Button>
                    </div>
                </div>

                <Button type="submit">
                    Publier le commentaire
                </Button>
            </form>

            <div className="space-y-6">
                {commentsWithUsers.map((comment) => (
                    <div key={comment._id} className="flex gap-4">
                        <Avatar>
                            <AvatarImage src={comment.user.image} />
                            <AvatarFallback>
                                {comment.user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    {comment.user.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.createdAt), {
                                        addSuffix: true,
                                        locale: fr
                                    })}
                                </span>
                            </div>
                            <p className="mt-1 text-sm whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CommentsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-40" /> {/* Titre */}
            
            <div className="space-y-4"> {/* Formulaire */}
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 