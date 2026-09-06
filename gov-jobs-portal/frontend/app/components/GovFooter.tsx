"use client";

import Link from "next/link";

const SOCIALS = [
  { label: "Facebook", url: "https://facebook.com/bdgarmentscareer", icon: "f" },
  { label: "Twitter / X", url: "https://twitter.com/bdgarmentscareer", icon: "𝕏" },
  { label: "LinkedIn", url: "https://linkedin.com/company/bdgarmentscareer", icon: "in" },
  { label: "WhatsApp", url: "https://wa.me/8801712345678", icon: "wa" },
  { label: "YouTube", url: "https://youtube.com/@bdgarmentscareer", icon: "▶" },
];

/** Footer for the gov jobs portal with official notice details + social links. */
export default function GovFooter() {
  const year = new Date().getFullYear();
  const mainUrl = process.env.NEXT_PUBLIC_MAIN_PORTAL_URL || "http://localhost:3000";

  return (
    <footer className="gov-footer">
      <div className="container gov-footer__inner">
        <div>
          <strong style={{ color: "#fff" }}>BD Garments Career Gov</strong>
          <div style={{ fontSize: "0.88rem", marginTop: "0.3rem" }}>
            Official public-sector &amp; government job circulars · Updated daily
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>Follow us</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                 aria-label={s.label} title={s.label}
                 style={{
                   width: 36, height: 36, borderRadius: "50%",
                   background: "rgba(255,255,255,0.14)", color: "#fff",
                   display: "inline-flex", alignItems: "center", justifyContent: "center",
                   fontWeight: 700, fontSize: "0.8rem",
                   transition: "background 0.2s ease, transform 0.2s ease",
                 }}
                 onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; }}
                 onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}>
                {s.icon}
              </a>
            ))}
          </div>
          <Link href={mainUrl} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", marginTop: "0.6rem", display: "inline-block" }}>
            ← BD Garments Career (Private Jobs)
          </Link>
        </div>

        <div style={{ textAlign: "right", fontSize: "0.88rem", color: "rgba(255,255,255,0.7)" }}>
          <div>© {year} BD Garments Career Gov</div>
          <div>All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}