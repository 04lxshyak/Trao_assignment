"use client";

import { AppHeader } from "@/components/AppHeader";
import { getToken } from "@/lib/session";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function ProtectedPage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <main className="page-shell min-h-screen" />;
  }

  return (
    <div className="page-shell min-h-screen">
      <AppHeader />
      {children}
    </div>
  );
}
