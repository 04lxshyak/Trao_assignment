"use client";

import { AppHeader } from "@/components/AppHeader";
import { getToken } from "@/lib/session";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function ProtectedPage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasToken = Boolean(getToken());

  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
    }
  }, [hasToken, router]);

  if (!hasToken) {
    return <main className="page-shell min-h-screen" />;
  }

  return (
    <div className="page-shell min-h-screen">
      <AppHeader />
      {children}
    </div>
  );
}
