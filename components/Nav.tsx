"use client";

import Link from "next/link";
import { useState } from "react";
import Shield from "./Shield";

export type NavLink = {
  href: string;
  label: string;
  /** Rendered as the green pill call-to-action at the end of the nav */
  pill?: boolean;
};

export default function Nav({
  brandHref = "/",
  links,
  toggleLabel = "Toggle menu",
  staffLabel = "Staff Login",
}: {
  brandHref?: string;
  links: NavLink[];
  toggleLabel?: string;
  staffLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="nav-inner">
        <Link href={brandHref} className="nav-mark">
          <Shield />
          <span>Senn Parents</span>
        </Link>
        <button
          className="nav-toggle"
          aria-label={toggleLabel}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          &#9776;
        </button>
        <ul className={open ? "nav-links open" : "nav-links"}>
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={link.pill ? "pill" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/login"
              className="staff-login"
              onClick={() => setOpen(false)}
            >
              {staffLabel}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
