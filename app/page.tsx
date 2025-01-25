import { Suspense } from "react";
import PostList from "@/components/post/PostList";
import { Skeleton } from "@/components/ui/skeleton";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { PostListSkeleton } from "@/components/post/PostSkeleton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!session ? (
        <div className="text-center py-12 border-b mb-12">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur DevBlog</h1>
          <p className="text-xl text-gray-600 mb-8">
            Partagez vos idées, découvrez des histoires inspirantes et rejoignez notre communauté de passionnés de technologies.
          </p>
          <div className="space-x-4">
            <Link 
              href="/page/login"
              className="inline-block bg-dark text-white px-6 py-2 rounded-md hover:bg-primary/10"
            >
              Se connecter
            </Link>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          {session ? "Articles récents" : "Articles les plus appréciés"}
        </h2>
        {session && (
          <Link
            href="/page/write"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Écrire un article
          </Link>
        )}
      </div>

      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </main>
  );
}
