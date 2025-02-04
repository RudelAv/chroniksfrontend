import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { AutorProfile } from "@/components/profile/autorProfile";
import { Metadata, ResolvingMetadata } from "next";

export const dynamic = "force-dynamic";

// Typage de generateMetadata avec les utilitaires Next.js
type GenerateMetadataProps = {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: GenerateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: `Author Page - ${params.userId}`,
  };
}

// Utilisation de PageProps pour le composant de page
interface PageProps {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const AutorPage = async ({ params, searchParams }: PageProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/page/login?callbackUrl=/page/autor/${params.userId}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AutorProfile session={session} userId={params.userId} />
    </div>
  );
};

export default AutorPage;