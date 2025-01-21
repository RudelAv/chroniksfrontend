import { Suspense } from "react";
import PostContent from "@/components/post/PostContent";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export default async function PostPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    console.log("session", session)

    if (!session) {
        redirect('/page/login?callbackUrl=/page/post/' + params.id);
    }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Suspense fallback={<PostSkeleton />}>
        <PostContent postId={params.id} />
      </Suspense>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  );
} 