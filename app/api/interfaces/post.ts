export interface Post {
    _id: string;
    title: string;
    content: string;
    imagePreview?: string;
    tags: string[];
    createdAt: string;
    author: {
        name: string;
        image?: string;
    };

} 