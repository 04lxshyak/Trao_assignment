import { Compass } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthPanelProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerHref: string;
  footerAction: string;
  children: ReactNode;
};

export function AuthPanel({ title, subtitle, footerText, footerHref, footerAction, children }: AuthPanelProps) {
  return (
    <main className="page-shell grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-black/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-8 flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-ink text-white">
            <Compass size={22} aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-ink/65">{subtitle}</p>
          </div>
        </div>

        {children}

        <p className="mt-6 text-center text-sm text-ink/65">
          {footerText}{" "}
          <Link href={footerHref} className="font-medium text-coral underline-offset-4 hover:underline">
            {footerAction}
          </Link>
        </p>
      </section>
    </main>
  );
}
