interface Community {
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