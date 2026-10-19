import Link from "next/link";

const FOOT_LINKS = {
  en: [
    { href: "/join", label: "Join" },
    { href: "/vote", label: "Vote" },
    { href: "/minutes", label: "Minutes" },
    { href: "/es", label: "Español" },
  ],
  es: [
    { href: "/unase", label: "Únase" },
    { href: "/vota", label: "Vote" },
    { href: "/minutes", label: "Actas" },
    { href: "/", label: "English" },
  ],
};

export default function Footer({ lang = "en" }: { lang?: "en" | "es" }) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <strong>Nicholas Senn High School</strong>
            5900 N. Glenwood Ave, Chicago IL 60660
            <br />
            <a href="mailto:sennparents@gmail.com">sennparents@gmail.com</a>
          </div>
          <div className="foot-links">
            {FOOT_LINKS[lang].map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="foot-bot">
          <span>
            &copy; 2026 Senn{" "}
            {lang === "es" ? "Consejo Asesor de Padres" : "Parent Advisory Council"}
          </span>
          <a
            className="runs-on"
            href="https://empactos.com"
            target="_blank"
            rel="noopener"
            aria-label="Runs on EMPACT"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/runs-on-empact-white.svg" alt="Runs on EMPACT" />
          </a>
        </div>
      </div>
    </footer>
  );
}
