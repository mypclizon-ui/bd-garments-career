import type { Metadata } from "next";
import "./globals.css";
import GovHeader from "./components/GovHeader";
import PageWrapper from "./components/PageWrapper";

export const metadata: Metadata = {
  title: "Bangladesh Government Job Portal",
  description: "The latest government and public-sector job circulars across Bangladesh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>
        <GovHeader />
        <PageWrapper>{children}</PageWrapper>
        <footer className="gov-footer">
          <div className="container gov-footer__inner">
            <span>© {new Date().getFullYear()} Bangladesh Government Job Portal</span>
            <span>Official notices · Updated daily</span>
          </div>
        </footer>
      </body>
    </html>
  );
}