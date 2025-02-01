import Link from "next/link";
import { 
    Users, 
    Search, 
    Clock, 
    Bookmark, 
    PlusCircle, 
    Book,
    Tag
  } from "lucide-react";





interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const menuItems = [
    {
      title: "My feed",
      items: [
        // { name: "Following", href: "/feed/following", icon: <Users /> },
        { name: "Explorer", href: "/feed/explore", icon: <Search /> },
        { name: "Mon historique", href: "/feed/history", icon: <Clock /> },
      ],

    },
    {
      title: "Mes flux",
      items: [
        { name: "fil personnalisé", href: "/feeds/custom", icon: <PlusCircle /> },
      ],


    },
    {
      title: "Communautés",
      items: [
        { name: "Rejoindre une communauté", href: "/network/squads", icon: <Users /> },
        { name: "Créer une communauté", href: "/page/network/new", icon: <PlusCircle /> },
      ],
    },
    {
      title: "Posts",
      items: [
        { name: "Enregistrés", href: "/bookmarks/quick", icon: <Bookmark /> },
        { name: "Écrire un article", href: "/page/write", icon: <Book /> },
      ],
    },

    {
      title: "Explorer",
      items: [
        { name: "Tags", href: "/discover/tags", icon: <Tag /> },
      ],
    },
  ];

  return (
    <div className={`w-64 h-screen sticky top-0 p-4 border-r ${className}`}>
      
      {menuItems.map((section) => (
        <div key={section.title} className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}