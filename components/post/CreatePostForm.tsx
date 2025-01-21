"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MDEditor from "@uiw/react-md-editor";
import { TagInput } from "@/components/post/tag-input";
import ApiPost from "@/app/api/posts/post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [link, setLink] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRepost, setIsRepost] = useState(false);
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
      formData.append("title", title);
      formData.append("content", content);
      formData.append("link", link);
      
      // Ajouter chaque tag individuellement au formData
      selectedTags.forEach(tag => {
        formData.append("tags[]", tag);
      });
      
      if (imageFile) {
        formData.append("imagePreview", imageFile);
      }

      const response = await ApiPost.createPost(session?.user?.accessToken, formData);

      if (response._id) {
        router.push(`/page/post/${response._id}`); // Redirection vers la page du post créé
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 max-w-xs rounded"
          />
        )}
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <TagInput
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
      </div>

      <div>
        <Label>Type de post</Label>
        <div className="flex space-x-4">
          <Button
            type="button"
            variant={!isRepost ? "default" : "outline"}
            onClick={() => setIsRepost(false)}
          >
            Nouveau post
          </Button>
          <Button
            type="button"
            variant={isRepost ? "default" : "outline"}
            onClick={() => setIsRepost(true)}
          >
            Repost
          </Button>
        </div>
      </div>

      {isRepost ? (
        <div>
          <Label htmlFor="link">Lien du post</Label>
          <Input
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required={isRepost}
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="content">Contenu</Label>
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || "")}
            height={400}
          />
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Publication en cours..." : "Publier"}
      </Button>
    </form>
  );
} 