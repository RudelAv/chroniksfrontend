import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {CommunityList} from "@/components/community/CommunityList";
import { Suspense } from "react";
import { PostListSkeleton } from "@/components/post/PostSkeleton";

export default async function CommunityPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/page/login?callbackUrl=/page/network/community');
    }
    return (
    <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Communautés</h1>
        <Suspense fallback={<PostListSkeleton />}>
            <CommunityList />
        </Suspense>
    </div>
    )
}