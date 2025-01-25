'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';

export default function SearchBar() {
    const router = useRouter();
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');

    // Si l'utilisateur n'est pas connecté, ne rien afficher
    if (!session?.user) {
        return null;
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Rechercher des posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
        </form>
    );
} 