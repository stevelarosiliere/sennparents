import type { Metadata } from "next";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "Parent Survey 2026-27 | Senn Parents",
  description:
    "Senn PAC Family Interest Survey 2026-2027. Two minutes. Tell the Parent Advisory Council what your family needs this school year.",
  openGraph: {
    title: "Senn Parent Survey 2026-27",
    description:
      "Two minutes. Tell the Senn Parent Advisory Council what your family needs this school year.",
    url: "https://sennparents.com/survey",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
};

export default function SurveyPage() {
  return <SurveyForm />;
}
