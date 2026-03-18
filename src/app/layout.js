import "./globals.css";
import Image from "next/image";
import Script from "next/script";
import { PreferencesProvider } from "../context/PreferencesContext";
import PreferencesBar from "../components/PreferencesBar";
import { HeaderNav, FooterNav } from "../components/HeaderNav";

export const metadata = {
  metadataBase: new URL("https://www.affordthiscar.com"),
  title: {
    default: "AffordThisCar",
    template: "%s | AffordThisCar",
  },
  description:
    "Check car affordability, compare vehicles, estimate ownership cost, review dealership deals, and explore monthly payment guides.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AffordThisCar",
    description:
      "Check car affordability, compare vehicles, estimate ownership cost, review dealership deals, and explore monthly payment guides.",
    url: "https://www.affordthiscar.com",
    siteName: "AffordThisCar",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AffordThisCar",
    description:
      "Check car affordability, compare vehicles, estimate ownership cost, review dealership deals, and explore monthly payment guides.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HHVYE4V8HS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HHVYE4V8HS');
          `}
        </Script>
      </head>

      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#f8fafc",
          color: "#111827",
        }}
      >
        <PreferencesProvider>
          <header
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 999,
              background: "#ffffff",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <a
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="AffordThisCar logo"
                  width={180}
                  height={50}
                  priority
                  style={{
                    width: "170px",
                    height: "auto",
                    objectFit: "contain",
                    maxWidth: "100%",
                  }}
                />
              </a>

              <div
                style={{
                  width: "140px",
                  flexShrink: 0,
                }}
              >
                <HeaderNav />
              </div>
            </div>
          </header>

          <div style={{ height: "74px" }} />

          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "14px 20px 0",
            }}
          >
            <PreferencesBar />
          </div>

          <main
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "20px 20px 40px",
            }}
          >
            {children}
          </main>

          <footer
            style={{
              marginTop: "40px",
              padding: "28px 20px",
              borderTop: "1px solid #e5e7eb",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ color: "#64748b", fontSize: "14px" }}>
                © 2026 AffordThisCar
              </div>

              <FooterNav />
            </div>
          </footer>
        </PreferencesProvider>
      </body>
    </html>
  );
}