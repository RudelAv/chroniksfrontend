'use client';

import { useEffect, useState } from 'react';
import { Heart, Share2, MessageCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApiPost from '@/app/api/posts/post';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Post {
    _id: string;
    likes: string[];
    comments: Array<{
        _id: string;
        user: string;
        content: string;
        createdAt: string;
    }>;
}

export default function PostActions({ postId }: { postId: string }) {
    const [post, setPost] = useState<Post | null>(null);
    const { data: session } = useSession();
    const isLiked = post?.likes.includes(session?.user?.id || '');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await ApiPost.getPost(session?.user.accessToken, postId);
                setPost(response);
            } catch (error) {
                toast.error("Erreur lors du chargement du post");
            }
        };
        
        if (session?.user.accessToken) {
            fetchPost();
        }
    }, [postId, session?.user.accessToken]);

    const handleLike = async () => {
        if (!session) return;

        try {
            const response = isLiked
                ? await ApiPost.unLikePost(session.user.accessToken, postId)
                : await ApiPost.likePost(session.user.accessToken, postId);
            
            setPost(response);
            toast.success(isLiked ? "Like retiré" : "Post liké");
        } catch (error) {
            toast.error("Une erreur est survenue");
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: 'Partager ce post',
                url: window.location.href
            });
        } catch (error) {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Lien copié dans le presse-papier");
        }
    };

    const handleSave = async () => {
        if (!session) return;

        try {
            await ApiPost.savePost(session.user.accessToken, postId);
            toast.success('post enregistré');
            // setPost(response);
        } catch (error:any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex items-center gap-4 py-4">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : ''}
            >
                <Heart className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {post?.likes.length || 0}
            </Button>
            
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => document.getElementById('comment-input')?.focus()}
            >
                <MessageCircle className="mr-2" />
                {post?.comments.length || 0} Commentaires
            </Button>

            <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSave}
            >
                <Bookmark className="mr-2" />
                Sauvegarder
            </Button>

            <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShare}
            >
                <Share2 className="mr-2" />
                Partager
            </Button>
        </div>
    );
} 