"use client";

import Link from "next/link";
import { Home, Calendar, Map as MapIcon, MessageCircle, BarChart3, User } from "lucide-react";

const items = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard#log", icon: Calendar, label: "Log" },
  { href: "/dashboard#map", icon: MapIcon, label: "Map" },
  { href: "/dashboard#community", icon: MessageCircle, label: "Sister" },
  { href: "/dashboard#trend", icon: BarChart3, label: "Trend" },
  { href: "/dashboard#profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-50 mx-auto flex h-20 max-w-[calc(100%-2rem)] items-center justify-around rounded-[32px] border border-white/10 bg-deep-forest/95 px-3 shadow-2xl backdrop-blur-xl">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1 text-white/70 transition-all active:scale-95"
          >
            <div className="rounded-2xl p-2">
              <Icon size={20} />
            </div>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}