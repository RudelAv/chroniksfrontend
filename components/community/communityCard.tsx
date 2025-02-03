import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Users } from "lucide-react";
import ApiCommunity from "@/app/api/community/community";
import { toast } from "sonner";

interface CommunityCardProps {
    community: {
        _id: string;
        name: string;
        description: string;
        image?: string;
        creator: { 
            _id: string;
            name: string;
            image?: string;
        };
        members: string[];
        admins: string[];
        posts: any[];
        messages: any[];
        events: any[];
        createdAt: string;
        updatedAt: string;
    }
}

export function CommunityCard({ community, accessToken }: { community: CommunityCardProps["community"], accessToken: any }) {

    const handleJoin = async () => {
        try {
            const response = await ApiCommunity.joinCommunity(accessToken, community._id);  
            console.log(response);
            if(response) {
                toast.success(`Vous avez rejoint la communauté ${community.name}`, {
                    description: `Vous pouvez maintenant participer aux discussions et aux événements de la communauté ${community.name}`
                });
            }  
        } catch (error: any) {
            console.log(error);
            toast.error("Une erreur est survenue ", error.message);
        }
        
    }
    return (
        <Card className="overflow-hidden">
            <div className="relative">
                {/* Background Image Container */}
                <div className="h-32 w-full relative">
                    {community.image ? (
                        <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${community.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500" />
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-6 left-4">
                    <Avatar className="h-12 w-12 ring-4 ring-white">
                        <AvatarImage src={community.creator.image} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {community.creator.name[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Member count badge */}
                <div className="absolute -bottom-6 right-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {community.members.length} membre{community.members.length > 1 ? 's' : ''}
                    </Badge>
                </div>
            </div>

            <CardHeader className="pt-8">
                <CardTitle className="flex items-center justify-between">
                    {community.name}
                </CardTitle>
                <CardDescription>
                    {community.description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Créé par {community.creator.name}
                    </p>
                    <div className="flex gap-2">
                        <Badge variant="outline">{community.posts.length} posts</Badge>
                        <Badge variant="outline">{community.events.length} événements</Badge>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Button className="w-full" onClick={handleJoin}>Rejoindre</Button>
            </CardFooter>
        </Card>
    )
}