'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import ApiCommunity from '@/app/api/community/community'
import { toast } from 'sonner'

export default function CreateCommunityForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (imageFile) {
          formData.append("image", imageFile);
        }

        const response = await ApiCommunity.createCommunity(session?.user?.accessToken, formData);

        if (response._id) {
          toast.success("Communauté créée avec succès");
          router.push(`/page/community/${response._id}`);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer une communauté</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Prévisualisation" className="w-24 h-24 rounded-md" />
            </div>  
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Création en cours...' : 'Créer'}
        </Button>
      </form>
    </div>
  )
}