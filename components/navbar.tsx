"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { PenLine, User } from "lucide-react";
import ApiLogin from "@/app/api/authentification/login";

export default function Navbar() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      if (session?.user?.accessToken && session?.user?.refreshToken) {
        await ApiLogin.signOut(
          session.user.accessToken,
          session.user.refreshToken
        );
      }
      await signOut({ callbackUrl: '/page/login' });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      await signOut({ callbackUrl: '/page/login' });
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <PenLine className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">DevBlog</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/page/write">
                  <Button variant="outline">Write Post</Button>
                </Link>
                <Link href="/page/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/page/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/page/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}