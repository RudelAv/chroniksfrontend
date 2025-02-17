"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, X } from 'lucide-react';
import ApiCommunity from '@/app/api/community/community';
import { toast } from 'sonner';

interface Location {
    type: 'physical' | 'online';
    address: string;
}

interface Props {
    communityId: string;
    accessToken?: string;
}

const CreateEventModal = ({ communityId, accessToken }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: {
      type: 'physical',
      address: ''
    },
    tags: []
  });

  const handleSubmit = async (e: { preventDefault: () => void; target: { flyer: { files: (string | Blob)[]; }; }; }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('location[type]', formData.location.type);
      formDataToSend.append('location[address]', formData.location.address);
      
      if (e.target.flyer.files[0]) {
        formDataToSend.append('flyer', e.target.flyer.files[0]);
      }

      await ApiCommunity.createEvent(accessToken, communityId, formDataToSend);
      toast.success('Événement créé avec succès!');
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: {
        type: 'physical',
        address: ''
      },
      tags: []
    });
    setPreviewImage(null);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    const fileInput = document.getElementById('flyer');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const hasAccess = await ApiCommunity.hasAdminAccess(accessToken, communityId);
        setIsAdmin(hasAccess);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setRoleLoading(false);
      }
    };

    if (accessToken && communityId) {
      checkAdminStatus();
    }
  }, [accessToken, communityId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      {!roleLoading && isAdmin && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Créer un événement
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouvel événement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location.type">Type de lieu</Label>
            <select
              id="location.type"
              name="location.type"
              value={formData.location.type}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="physical">Physique</option>
              <option value="virtual">Virtuel</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location.address">Adresse</Label>
            <Input
              id="location.address"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flyer">Image/Flyer</Label>
            <Input
              id="flyer"
              name="flyer"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {previewImage && (
              <div className="relative w-full h-48">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Création en cours...' : 'Créer l\'événement'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;