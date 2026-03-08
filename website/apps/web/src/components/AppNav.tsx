"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWishlist } from "../contexts/WishlistContext";

export function AppNav() {
  const pathname = usePathname();
  const { items } = useWishlist();

  const links = [
    { href: "/", label: "Home" },
    { href: "/wishlist", label: "Wishlist", badge: items.length },
    { href: "/profile", label: "Profile" },
    { href: "/compliance", label: "Compliance" },
  ];

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-elevated)",
      }}
    >
      <nav
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "var(--space-4) var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
        aria-label="Main"
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--font-size-xl)",
            fontWeight: 700,
            color: "var(--text)",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          Cigar
        </Link>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            gap: "var(--space-1)",
            alignItems: "center",
          }}
        >
          {links.map(({ href, label, badge }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-4)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--accent)" : "var(--text-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s, background 0.2s",
                  }}
                  className="app-nav-link"
                >
                  {label}
                  {badge != null && badge > 0 && (
                    <span
                      style={{
                        background: "var(--accent)",
                        color: "#0f0e0c",
                        fontSize: "var(--font-size-xs)",
                        fontWeight: 700,
                        padding: "0.125rem 0.375rem",
                        borderRadius: "999px",
                        minWidth: "1.25rem",
                        textAlign: "center",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
