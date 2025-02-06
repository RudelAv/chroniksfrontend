import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import CreatePostForm from "@/components/post/CreatePostForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Créer un nouveau post - Chroniks',
  description: 'Partagez vos connaissances et vos idees avec le monde, sur Chroniks',
};

export default async function WritePage() {
    const session = await getServerSession(authOptions);
    console.log("session", session)

    if (!session) {
        redirect('/page/login?callbackUrl=/page/write');
    }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau post</h1>
      <CreatePostForm />
    </div>
  );
} 