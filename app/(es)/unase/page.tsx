import type { Metadata } from "next";
import UnasePlaybook from "./UnasePlaybook";

export const metadata: Metadata = {
  title: "Guía del CAP | Senn Parents",
  description:
    "Aprenda cómo funciona el Título I en Senn High School, qué hace el CAP y cómo convertirse en miembro. Una guía de 7 pasos para padres.",
  openGraph: {
    title: "Guía del CAP | Senn Parents",
    description:
      "Aprenda cómo funciona el Título I en Senn High School, qué hace el CAP y cómo convertirse en miembro.",
    type: "website",
    url: "https://sennparents.com/unase",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
};

export default function UnasePage() {
  return <UnasePlaybook />;
}
