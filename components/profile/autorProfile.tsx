"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Session } from 'next-auth';
import Image from 'next/image';
import ApiProfile from '@/app/api/authentification/profile';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/stores/useStore'
import ApiPost from '@/app/api/posts/post';
import { Post } from '@/app/api/interfaces/post';
import PostList from '../post/PostList';
import { PostListSkeleton } from '../post/PostSkeleton';
import PostCard from '../post/PostCard';

interface ProfileFormProps {
  session: Session;
  userId: string;
}


export const AutorProfile: React.FC<ProfileFormProps> = ({ session, userId }) => {
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { user, setUser } = useStore();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = (session as any).user?.accessToken;
        console.log(" voici l'accessToken", accessToken)
        if (!accessToken) {
          toast({
            title: "Erreur",
            description: "Token d'authentification non trouvé",
            variant: "destructive",
          });
          return;
        }

        const profileData = await ApiProfile.getUserInfo(accessToken, userId);
        console.log("profileData", profileData)
        if (profileData) {
          setProfileImage(profileData.image || null);
          setUser(profileData);
        }

        const posts = await ApiPost.getPostByAuthor(accessToken, userId);
        setPosts(posts);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données du profil",
          variant: "destructive",
        });
      }
    };

    fetchProfileData();
  }, [session, toast, setUser]);


  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Section Photo de profil */}
      <section className="p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Photo de profil</h2>
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src={profileImage || user?.image || '/globe.svg'}
              alt="Photo de profil"
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section Informations du profil */}
      <section className="p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Informations du profil</h2>
        
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              value={user?.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              value={user?.bio}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={4}
              disabled
            />
          </div>
      </section>

      {/* Section Posts */}
      <section className="p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <Suspense fallback={<PostListSkeleton />}>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))} 
        </Suspense>
      </section>
    </div>
  );
}; 