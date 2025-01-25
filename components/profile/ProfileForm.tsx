"use client";

import React, { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import Image from 'next/image';
import ApiProfile from '@/app/api/authentification/profile';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/stores/useStore'

interface ProfileFormProps {
  session: Session;
  userId?: string;
  readOnly?: boolean;
}

interface ProfileFormData {
  name: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ session, userId, readOnly }) => {
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { user, setUser } = useStore();

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

        const profileData = await ApiProfile.getProfile(accessToken);
        if (profileData) {
          setFormData(prev => ({
            ...prev,
            name: profileData.name || '',
            bio: profileData.bio || '',
          }));
          setProfileImage(profileData.image || null);
          setUser(profileData);
        }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const accessToken = (session as any).user?.accessToken;
        if (!accessToken) {
          toast({
            title: "Erreur",
            description: "Authentication token not found",
            variant: "destructive",
          });
          return;
        }

        const response = await ApiProfile.uploadProfileImage(accessToken, formData);
        if (response.image) {
          setProfileImage(response.image);
          if (session.user) {
            session.user.image = response.image;
          }
          toast({
            title: "Succès",
            description: "Photo de profil mise à jour avec succès",
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Échec du téléchargement de l'image",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const accessToken = (session as any).user?.accessToken;
      if (!accessToken) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        return;
      }

      // Préparer les données à envoyer
      const updateData = {
        name: formData.name,
        bio: formData.bio,
      };

      const response = await ApiProfile.updateProfile(accessToken, updateData);
      
      if (response && response.name) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        
        setFormData(prev => ({
          ...prev,
          name: response.name,
          bio: response.bio || '',
        }));
        setUser(response.user)
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords don't match",
          variant: "destructive",
        });
        return;
      }

      if (!formData.currentPassword) {
        toast({
          title: "Error",
          description: "Current password is required",
          variant: "destructive",
        });
        return;
      }

      const accessToken = (session as any).user?.accessToken;
      if (!accessToken) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        return;
      }

      const updateData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      const response = await ApiProfile.updatePassword(accessToken, updateData);
      
      if (response && response.success) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating your password",
        variant: "destructive",
      });
    }
  };

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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-image"
          />
          <label
            htmlFor="profile-image"
            className="btn btn-secondary cursor-pointer"
          >
            Changer la photo
          </label>
        </div>
      </section>

      {/* Section Informations du profil */}
      <section className="p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Informations du profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            <p className="text-sm text-gray-500 mt-1">Email ne peut être modifié</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </section>

      {/* Section Changement de mot de passe */}
      <section className="p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Changement de mot de passe</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Mot de passe actuel</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Nouveau mot de passe</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}; 