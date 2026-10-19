import Link from "next/link";
import { GROUPS } from "@/lib/umbrella-data";

export default function UmbrellaFooter() {
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
            {GROUPS.map((g) => (
              <Link key={g.slug} href={`/groups/${g.slug}`}>
                {g.name}
              </Link>
            ))}
            <Link href="/#calendar">Events</Link>
            <Link href="/#join">Join</Link>
          </div>
        </div>
        <div className="foot-bot">
          <span>&copy; 2026 Senn Parents</span>
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
