import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trao AI Trip Planner",
  description: "Multi-user AI travel itinerary planner"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
