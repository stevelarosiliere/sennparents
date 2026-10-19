import type { Metadata } from "next";
import UmbrellaHome from "@/components/home/UmbrellaHome";

export const metadata: Metadata = {
  title: "Senn Parents | Every parent group at Senn, one front door",
  description:
    "Every parent group at Nicholas Senn High School, one place to find them, one form to join any of them.",
  keywords:
    "Senn High School, Parent Advisory Council, PAC, LSC, BAC, Friends of Senn, Title I, Chicago, Rogers Park, Edgewater, parent engagement, CPS, Nicholas Senn",
  openGraph: {
    title: "Senn Parents",
    description:
      "Every parent group at Nicholas Senn High School, one place to find them, one form to join any of them.",
    type: "website",
    url: "https://sennparents.com",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Senn Parents",
    description:
      "Every parent group at Nicholas Senn High School, one place to find them, one form to join any of them.",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
};

export default function HomePage() {
  return <UmbrellaHome />;
}
