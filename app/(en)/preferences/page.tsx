import type { Metadata } from "next";
import Nav from "@/components/Nav";
import UmbrellaFooter from "@/components/home/UmbrellaFooter";
import Preferences from "@/components/Preferences";

export const metadata: Metadata = {
  title: "Your email lists | Senn Parents",
  robots: { index: false },
};

const navLinks = [
  { href: "/#groups", label: "Groups" },
  { href: "/#calendar", label: "Events" },
  { href: "/#join", label: "Join", pill: true },
];

export default async function PreferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; action?: string }>;
}) {
  const { token, action } = await searchParams;
  return (
    <>
      <Nav links={navLinks} />
      <main className="auth-page">
        <Preferences token={token ?? ""} unsubscribe={action === "unsubscribe"} />
      </main>
      <UmbrellaFooter />
    </>
  );
}
