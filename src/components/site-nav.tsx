"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const path = usePathname();
  const onContoh = path.startsWith("/contoh") || path.startsWith("/aplikasi");

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "#fff",
        borderBottom: "1px solid #d7e0ee",
      }}
    >
      <div style={{ height: 4, background: "#1d4ed8" }} />
      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "0.75rem 1rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <strong>Prompt AI-GAF</strong>
          <span
            style={{
              display: "block",
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#5b6d86",
            }}
          >
            Penjana brief aplikasi
          </span>
        </Link>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <NavLink href="/" current={!onContoh}>
            Jana prompt
          </NavLink>
          <NavLink href="/contoh" current={onContoh}>
            Halaman contoh
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      style={{
        background: current ? "#1d4ed8" : "#eef3f9",
        color: current ? "#fff" : "#12203a",
        textDecoration: "none",
        borderRadius: 8,
        padding: "0.35rem 0.75rem",
        fontSize: 14,
        fontWeight: current ? 600 : 500,
      }}
    >
      {children}
    </Link>
  );
}
