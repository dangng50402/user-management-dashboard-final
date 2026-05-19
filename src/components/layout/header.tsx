"use client";

import { Menu } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";

export function Header() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="flex h-16 items-center border-b px-4 gap-4">
      {/* Hamburger — chỉ hiện trên mobile */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <span className="text-sm font-medium text-muted-foreground">
        User Management Dashboard
      </span>
    </header>
  );
}