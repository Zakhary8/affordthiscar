import "./globals.css";
import Image from "next/image";
import Script from "next/script";

import { PreferencesProvider } from "../context/PreferencesContext";
import { VehicleProvider } from "../context/VehicleContext";
import { GarageProvider } from "../context/GarageContext";

import PreferencesBar from "../components/PreferencesBar";
import { HeaderNav, FooterNav } from "../components/HeaderNav";

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
          <VehicleProvider>
            <GarageProvider>
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
                    padding: "10px 20px 8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <a
                    href="/"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      textDecoration: "none",
                      lineHeight: 0,
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="AffordThisCar logo"
                      width={420}
                      height={120}
                      priority
                      style={{
                        width: "clamp(280px, 62vw, 420px)",
                        height: "auto",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </a>
                </div>
              </div>

              <div
                style={{
                  maxWidth: "1100px",
                  margin: "0 auto",
                  padding: "10px 20px 0",
                }}
              >
                <HeaderNav />
              </div>

              <div
                style={{
                  maxWidth: "1100px",
                  margin: "0 auto",
                  padding: "10px 20px 0",
                }}
              >
                <PreferencesBar />
              </div>

              <main
                style={{
                  maxWidth: "1100px",
                  margin: "0 auto",
                  padding: "18px 20px 40px",
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
            </GarageProvider>
          </VehicleProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}