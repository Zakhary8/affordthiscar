import "./globals.css";
import Image from "next/image";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://www.affordthiscar.com"),
  title: {
    default: "AffordThisCar",
    template: "%s | AffordThisCar",
  },
  description:
    "Check car affordability, compare vehicles, estimate ownership cost, review dealership deals, and explore monthly payment guides.",
};

const navLinkStyle = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: "600",
  fontSize: "15px",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
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
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
            background: "#ffffff",
            position: "sticky",
            top: 0,
            zIndex: 50,
            flexWrap: "wrap",
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
              width={220}
              height={60}
              priority
              style={{
                width: "220px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </a>

          <nav
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <a href="/" style={navLinkStyle}>Calculator</a>
            <a href="/compare" style={navLinkStyle}>Compare</a>
            <a href="/ownership-cost" style={navLinkStyle}>Ownership Cost</a>
            <a href="/deal-review" style={navLinkStyle}>Deal Review</a>
            <a href="/car-payment/30000" style={navLinkStyle}>Payments</a>
            <a href="/income-needed/30000" style={navLinkStyle}>Income Needed</a>
          </nav>
        </header>

        <main
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "40px 20px",
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
          </div>
        </footer>
      </body>
    </html>
  );
}