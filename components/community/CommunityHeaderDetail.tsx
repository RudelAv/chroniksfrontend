"use client"; // Indique que ce composant s'exécute côté client

import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { User } from 'lucide-react';
import { useSession } from "next-auth/react";
import ApiCommunity from "@/app/api/community/community";
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { toast } from 'sonner';

export interface CommunityHeaderProps {
    communityId: string;
}

const CommunityHeader = ({ communityId }: CommunityHeaderProps) => {
    const { data: session, status } = useSession();
    const [communityData, setCommunityData] = useState<any>(null);
    const [isMember, setIsMember] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.accessToken) {
            const fetchCommunityData = async () => {
                try {
                    const response = await ApiCommunity.getCommunity(session.user.accessToken, communityId);

                    setCommunityData({
                        name: response.name,
                        membersCount: response.members.length,
                        image: response.image,
                        handle: response.handle || "",
                        createdDate: new Date(response.createdAt).toLocaleDateString('fr-FR', {
                            month: 'short',
                            year: 'numeric'
                        }),
                        category: response.category,
                        description: response.description,
                        stats: {
                            posts: response.stats?.posts || 0,
                            views: response.stats?.views || 0,
                            upvotes: response.stats?.upvotes || 0
                        },
                        moderators: response.admins.map((admin: any) => ({
                            name: admin.name,
                            role: "admin"
                        }))
                    });

                    console.log(response.members, session.user.id);
                    // Vérification si l'utilisateur est déjà membre
                    if (response.members.some((member: any) => member._id === session.user.id)) {
                        setIsMember(true);
                    }
                } catch (e) {
                    console.error("Error fetching community data:", e);
                    setError(e instanceof Error ? e.message : "Une erreur est survenue");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCommunityData();
        }
    }, [session, status, communityId]);

    const handleJoin = async () => {
        try {
            const response = await ApiCommunity.joinCommunity(session?.user?.accessToken, communityId);
            if (response) {
                toast.success(`Vous avez rejoint la communauté ${communityData?.name}`, {
                    description: `Vous pouvez maintenant participer aux discussions et aux événements de la communauté ${communityData?.name}`
                });

                // Mettre à jour l'état après l'ajout du membre
                setCommunityData((prevData: any) => ({
                    ...prevData,
                    membersCount: prevData.membersCount + 1
                }));
                setIsMember(true);
            }
        } catch (error: any) {
            toast.error("Une erreur est survenue ", error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
            </div>
        );
    }

    if (!communityData) {
        return <p>Aucune donnée disponible pour cette communauté.</p>;
    }

    return (
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
            <div className="max-w-4xl mx-auto">
                {/* Header with Avatar and Stats */}
                <div className="flex items-start gap-4 mb-6">
                    {/* Community Avatar */}
                    <Avatar className="overflow-hidden rounded-full h-16 w-16">
                        {communityData.image && (
                            <img
                                src={communityData.image}
                                alt={communityData.name}
                                className="h-full w-full object-cover"
                            />
                        )}
                        <AvatarFallback>
                            {communityData.name[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* Community Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold">{communityData.name}</h1>
                            <Badge variant="secondary" className="bg-purple-700 text-white">
                                Featured Squad
                            </Badge>
                        </div>

                        <div className="text-gray-300 text-sm mb-4">
                            {communityData.handle} • Créée {communityData.createdDate} • {communityData.category}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 text-sm">
                            <div>
                                <span className="font-bold">{communityData.stats.posts}</span>
                                <span className="text-gray-300 ml-1">Posts</span>
                            </div>
                            <div>
                                <span className="font-bold">{communityData.stats.views}</span>
                                <span className="text-gray-300 ml-1">Views</span>
                            </div>
                            <div>
                                <span className="font-bold">{communityData.stats.upvotes}</span>
                                <span className="text-gray-300 ml-1">Upvotes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-200 mb-6">{communityData.description}</p>

                {/* Join Button and Members */}
                <div className="flex items-center gap-4 mb-8">
                    {!isMember && (
                        <button
                            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                            onClick={handleJoin}
                        >
                            Rejoindre la communauté
                        </button>
                    )}
                    <div className="flex items-center">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-purple-900 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                            </div>
                        </div>
                        <span className="ml-4 text-sm text-gray-300">{communityData.membersCount} membres</span>
                    </div>
                </div>

                {/* Moderators */}
                <div>
                    <h3 className="text-gray-300 mb-3">Administrateurs</h3>
                    <div className="flex flex-wrap gap-2">
                        {communityData.moderators.map((mod: any) => (
                            <div key={mod.name} className="bg-gray-800 rounded-full px-4 py-2 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{mod.name}</span>
                                <Badge variant="outline" className="text-purple-400 border-purple-400">
                                    {mod.role}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityHeader;
