import type { Metadata } from "next";
import "./globals.css";
import GovHeader from "./components/GovHeader";
import GovFooter from "./components/GovFooter";
import PageWrapper from "./components/PageWrapper";
import GovChatPopup from "./components/GovChatPopup";
import GovCookiesConsent from "./components/GovCookiesConsent";

export const metadata: Metadata = {
  title: "BD Garments Career Gov — Job Portal",
  description: "Government and public-sector job circulars across Bangladesh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>
        <GovHeader />
        <PageWrapper>{children}</PageWrapper>
        <GovFooter />
        <GovChatPopup />
        <GovCookiesConsent />
      </body>
    </html>
  );
}