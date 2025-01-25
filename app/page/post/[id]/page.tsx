import { Suspense } from "react";
import PostContent from "@/components/post/PostContent";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import CommentSection from "@/components/post/CommentSection";
import PostActions from "@/components/post/PostActions";
import { PostSkeleton } from "@/components/post/PostSkeleton";

export default async function PostPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/page/login?callbackUrl=/page/post/' + params.id);
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <Suspense fallback={<PostSkeleton />}>
                <PostContent postId={params.id} />
            </Suspense>

            <PostActions postId={params.id} />
            
            <div className="border-t pt-8">
                <CommentSection postId={params.id} />
            </div>
        </div>
    );
}