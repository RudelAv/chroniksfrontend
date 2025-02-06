import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { PostListSkeleton } from "@/components/post/PostSkeleton";
import SavedPostList from "@/components/post/SavedPostList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SavedPost() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/page/login?callbackUrl=/page/post/saved-post');
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<PostListSkeleton />}>
                <SavedPostList />
            </Suspense>
        </main>
    )
}