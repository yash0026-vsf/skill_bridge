import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { officer } from "./data";
import { getCurrentUserProfile, getUserInitials } from "@/lib/current-user";

export function DashboardTopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const currentUser = getCurrentUserProfile();
  const userInitials = getUserInitials(currentUser.name);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-card/95 px-4 backdrop-blur lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search"
          className="h-10 w-full rounded-lg border border-border bg-muted/60 pl-9 pr-14 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent focus:bg-card"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
          ⌘K
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </button>

        <div className="h-8 w-px bg-border" />

        <Link
          to="/build-profile"
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
            {userInitials}
          </span>

          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-foreground">
              {currentUser.name}
            </span>
            <span className="block text-xs leading-tight text-muted-foreground">
              {currentUser.designation || officer.shortRole}
            </span>
          </span>

          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
}
