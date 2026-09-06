"use client";

import Link from "next/link";

/**
 * Header for the standalone government jobs portal. Branding follows the
 * parent "BD Garments Career" brand with a custom "Gov" badge, and links
 * back to the main BD Garments Career portal.
 */
export default function GovHeader() {
  const mainUrl = process.env.NEXT_PUBLIC_MAIN_PORTAL_URL || "http://localhost:3000";

  return (
    <header className="gov-header">
      <div className="container gov-header__inner">
        <div className="gov-brand">
          {/* Custom logo / seal */}
          <span className="gov-brand__seal" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" role="img" aria-label="BD Garments Career Gov logo">
              <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.25" />
              <path d="M9 20 L16 10 L23 20 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
              <circle cx="16" cy="20" r="2" fill="currentColor" />
              <path d="M11 17 h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h1>BD Garments Career <span className="gov-badge">Gov</span></h1>
            <small>Government & Public-Sector Job Portal</small>
          </div>
        </div>
        <nav>
          <ul className="gov-nav">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/jobs">All Jobs</Link></li>
            <li><Link href="/apply">How to Apply</Link></li>
            <li>
              <Link href={mainUrl} target="_blank" rel="noopener noreferrer">
                Private Jobs
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}