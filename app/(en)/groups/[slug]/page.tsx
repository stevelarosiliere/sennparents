import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GroupPage from "@/components/groups/GroupPage";
import { GROUPS, GROUP_BY_SLUG } from "@/lib/umbrella-data";

export function generateStaticParams() {
  return GROUPS.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = GROUP_BY_SLUG[slug];
  if (!g) return {};
  return {
    title: `${g.full} — Senn Parents`,
    description: g.blurb,
    openGraph: {
      title: `${g.full} — Senn Parents`,
      description: g.blurb,
      type: "website",
      url: `https://sennparents.com/groups/${g.slug}`,
      images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = GROUP_BY_SLUG[slug];
  if (!g) notFound();
  return <GroupPage group={g} />;
}
