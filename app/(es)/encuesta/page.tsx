import type { Metadata } from "next";
import EncuestaForm from "./EncuestaForm";

export const metadata: Metadata = {
  title: "Encuesta para Padres | Senn Parents",
  description:
    "Encuesta para padres de Senn High School. Díganos qué necesita su familia.",
};

export default function EncuestaPage() {
  return <EncuestaForm />;
}
