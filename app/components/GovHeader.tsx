"use client";

import Link from "next/link";

/**
 * Header for the standalone government jobs portal. Includes a link back
 * to the main BD Garments Career portal.
 */
export default function GovHeader() {
  return (
    <header className="gov-header">
      <div className="container gov-header__inner">
        <div className="gov-brand">
          <span className="gov-brand__seal" aria-hidden="true">গ</span>
          <div>
            <h1>Bangladesh Government Job Portal</h1>
            <small>সরকারি চাকরির খবর | Public Service Job Notices</small>
          </div>
        </div>
        <nav>
          <ul className="gov-nav">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/jobs">All Jobs</Link></li>
            <li><Link href="/apply">How to Apply</Link></li>
            <li>
              <Link href={process.env.NEXT_PUBLIC_MAIN_PORTAL_URL || "http://localhost:3000"} target="_blank" rel="noopener noreferrer">
                Private Jobs
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}