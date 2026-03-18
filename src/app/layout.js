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
          {/* 🔥 BIG HEADER */}
          <div
            style={{
              background: "#ffffff",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "24px 20px 20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <a
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  width: "100%",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="AffordThisCar logo"
                  width={400}
                  height={120}
                  priority
                  style={{
                    width: "clamp(260px, 55vw, 420px)",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </a>
            </div>
          </div>

          {/* MENU */}
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "16px 20px 0",
            }}
          >
            <HeaderNav />
          </div>

          {/* PREFERENCES */}
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "16px 20px 0",
            }}
          >
            <PreferencesBar />
          </div>

          {/* MAIN */}
          <main
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "24px 20px 40px",
            }}
          >
            {children}
          </main>

          {/* FOOTER */}
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