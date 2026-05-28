"use client";

import { clearSession, getSessionUser } from "@/lib/session";
import { LogOut, Map, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppHeader() {
  const router = useRouter();
  const name = getSessionUser()?.name ?? "";

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <header className="border-b border-black/10 bg-white/82 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold text-ink">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-white">
            <Map size={20} aria-hidden />
          </span>
          <span>Trao Trips</span>
        </Link>

        <div className="flex items-center gap-2">
          {name ? <span className="hidden text-sm text-ink/65 sm:inline">{name}</span> : null}
          <Link
            href="/dashboard"
            className="grid h-10 w-10 place-items-center rounded-md border border-black/10 bg-white text-ink transition hover:border-moss hover:text-moss"
            aria-label="Create or view trips"
            title="Trips"
          >
            <Plus size={18} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={logout}
            className="grid h-10 w-10 place-items-center rounded-md border border-black/10 bg-white text-ink transition hover:border-coral hover:text-coral"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={18} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
