"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { Menu, PenLine, User, X } from "lucide-react";
import ApiLogin from "@/app/api/authentification/login";
import SearchBar from "./navbar/SearchBar";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

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

  const NavItems = () => (
    <>
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
    </>
  );

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <PenLine className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">DevBlog</span>
            </Link>
          </div>

          {/* Barre de recherche - cachée sur mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>

          {/* Menu mobile */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                <div className="flex flex-col gap-4 mt-6">
                  <div className="mb-4">
                    <SearchBar />
                  </div>
                  <div className="flex flex-col gap-2">
                    <NavItems />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Barre de recherche mobile - visible uniquement sur mobile en dessous du header */}
      <div className="md:hidden px-4 py-2">
        <SearchBar />
      </div>
    </nav>
  );
}