import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth-options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Ajoutez ici la logique pour uploader l'image vers votre service de stockage
    // (par exemple Cloudinary, AWS S3, etc.)
    // et retournez l'URL de l'image

    return NextResponse.json({ url: "URL_DE_L_IMAGE" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'image" },
      { status: 500 }
    );
  }
} 