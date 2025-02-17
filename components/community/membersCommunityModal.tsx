import ApiCommunity from "@/app/api/community/community";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, User, X, Loader2 } from "lucide-react";

interface MembersCommunityModalProps {
    communityId: string;
    accessToken: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Member {
    _id: string;
    name: string;
    image?: string;
    bio?: string;
    role?: string;
}

export default function MembersCommunityModal({
    communityId,
    accessToken,
    isOpen,
    onOpenChange,
}: MembersCommunityModalProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastMemberElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreMembers();
            }
        });

        if (node) observerRef.current.observe(node);
    }, [isLoading, hasMore]);

    const loadMoreMembers = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const response = await ApiCommunity.getCommunityMembers(
                accessToken,
                communityId,
                nextPage,
                10 // nombre de membres par page
            );

            if (response.length === 0) {
                setHasMore(false);
            } else {
                setMembers(prevMembers => [...prevMembers, ...response]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Error fetching more members:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setMembers([]);
            setFilteredMembers([]);
            setPage(1);
            setHasMore(true);
            setIsLoading(true);

            const fetchInitialMembers = async () => {
                try {
                    const response = await ApiCommunity.getCommunityMembers(
                        accessToken,
                        communityId,
                        1, // page initiale
                        10 // nombre de membres par page
                    );

                    setMembers(response);
                    setFilteredMembers(response);
                    setHasMore(response.length >= 10); // S'il y a au moins 10 éléments, il y a probablement plus à charger
                } catch (error) {
                    console.error("Error fetching members:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchInitialMembers();
        }
    }, [communityId, accessToken, isOpen]);

    useEffect(() => {
        if (searchQuery) {
            const results = members.filter(member =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMembers(results);
        } else {
            setFilteredMembers(members);
        }
    }, [searchQuery, members]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Squad members</DialogTitle>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
                        <X className="h-4 w-4" />
                    </DialogClose>
                </DialogHeader>

                <div className="relative my-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="pl-8 pr-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-col space-y-4 max-h-96 overflow-y-auto">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member, index) => (
                            <div
                                key={member._id}
                                ref={index === filteredMembers.length - 1 ? lastMemberElementRef : null}
                                className="flex items-center justify-between py-2"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="h-12 w-12 relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                        {member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-1">
                                            <span className="font-medium">{member.name}</span>
                                            {member.role === "admin" && (
                                                <span className="text-purple-500 text-xs ml-1">Admin</span>
                                            )}
                                        </div>
                                        {member.bio && member.bio.trim() !== "" && (
                                            <div className="text-sm text-gray-700 line-clamp-1">{member.bio}</div>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2"
                                >
                                    Follow
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            {isLoading ? "Chargement..." : "Aucun membre trouvé"}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                    )}

                    {!hasMore && filteredMembers.length > 0 && (
                        <div className="text-center py-2 text-sm text-gray-500">
                            Tous les membres ont été chargés
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}