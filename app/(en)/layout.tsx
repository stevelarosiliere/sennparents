import type { Metadata } from "next";
import { figtree } from "../fonts";
import ConvexClientProvider from "../../components/ConvexClientProvider";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sennparents.com"),
  icons: {
    icon: "/Brand-Assets/Logo/Social/sp-shield.jpg",
    apple: "/Brand-Assets/Logo/Social/sp-shield.jpg",
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
