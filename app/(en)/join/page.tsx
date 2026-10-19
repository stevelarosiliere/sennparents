import type { Metadata } from "next";
import JoinPlaybook from "./JoinPlaybook";

export const metadata: Metadata = {
  title: "PAC Playbook | Senn Parents",
  description:
    "Learn how Title I works at Senn High School, what the PAC does, and how to become a member. A 7-step walkthrough for parents.",
  openGraph: {
    title: "PAC Playbook | Senn Parents",
    description:
      "Learn how Title I works at Senn High School, what the PAC does, and how to become a member.",
    type: "website",
    url: "https://sennparents.com/playbook",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
};

export default function JoinPage() {
  return <JoinPlaybook />;
}
