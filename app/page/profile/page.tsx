import React from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

const ProfilePage = async () => {
    const session = await getServerSession(authOptions);
    console.log("session", session)

    if (!session) {
        redirect('/page/login');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
            <ProfileForm session={session} />
        </div>
    );
};

export default ProfilePage;