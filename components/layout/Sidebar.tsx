"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Calendar, Users, Mail, Lock, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  locked?: boolean;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Properties (Sheets)", href: "/properties", icon: FileSpreadsheet },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Dates", href: "/dates", icon: Calendar, locked: true },
  { name: "Contacts", href: "/contacts", icon: Mail, locked: true },
  { name: "Users", href: "/users", icon: Users, locked: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold playfair-display-sc text-primary">
          SafeStays
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Luxury Dashboard
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                {item.locked ? (
                  <div className="relative group">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground cursor-not-allowed opacity-50">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                      <Lock className="w-4 h-4 ml-auto" />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
                      <div className="bg-primary text-primary-foreground text-xs px-3 py-2 rounded-lg shadow-lg border border-border">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          <span>Demo Version - Feature Locked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Demo Version
        </p>
      </div>
    </aside>
  );
}
