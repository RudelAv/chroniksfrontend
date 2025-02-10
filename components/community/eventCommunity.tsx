"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApiCommunity from '@/app/api/community/community';
import { toast } from 'sonner';

interface Location {
  type: 'online' | 'physical';
  address?: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: Location;
  organizer: string;
  registrations: string[];
  tags: string[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

interface Community {
  _id: string;
  events: Event[];
  // ... autres propriétés
}

interface EventsCalendarProps {
  communityId: string;
}

const EventsCalendar = ({ communityId }: EventsCalendarProps) => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityEvents = async () => {
      try {
        if (session?.user?.accessToken) {
          const communityData = await ApiCommunity.getCommunity(
            session.user.accessToken,
            communityId
          );
          setEvents(communityData.events);
        }
      } catch (error) {
        console.error('Failed to fetch community events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityEvents();
  }, [communityId, session?.user?.accessToken]);

  const handleRegister = async (eventId: string) => {
    try {
      if (!session?.user?.accessToken) return;

      await ApiCommunity.registerForEvent(
        session.user.accessToken,
        communityId,
        eventId
      );

      // Mise à jour locale des événements
      setEvents(prevEvents =>
        prevEvents.map(event => {
          if (event._id === eventId) {
            return {
              ...event,
              registrations: [...event.registrations, session.user?.id as string]
            };
          }
          toast.success('Inscription reussie');
          return event;
        })
      );
    } catch (error) {
      console.error('Failed to register for event:', error);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8">Loading events...</div>;

  if (!events.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Aucun événement n'est prévu pour le moment
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Événements de la communauté
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location.type === 'online' ? 'Événement en ligne' : event.location.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.registrations.length} participant(s)
                    </div>
                  </div>

                  {session?.user && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleRegister(event._id)}
                        disabled={event.registrations.includes(session.user.id)}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {event.registrations.includes(session.user.id)
                          ? 'Déjà inscrit'
                          : "S'inscrire"}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsCalendar;