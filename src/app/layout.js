import "./globals.css";
import Image from "next/image";

export const metadata = {
  metadataBase: new URL("https://affordthiscar.com"),
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
    url: "https://affordthiscar.com",
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

const navLinkStyle = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: "600",
  fontSize: "15px",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
            padding: "16px 28px",
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
              gap: "14px",
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <Image
              src="/logo.png"
              alt="AffordThisCar logo"
              width={220}
              height={70}
              priority
              style={{ width: "auto", height: "56px" }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: 1,
              }}
            >
              AffordThisCar
            </span>
          </a>

          <nav
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <a href="/" style={navLinkStyle}>
              Calculator
            </a>
            <a href="/compare" style={navLinkStyle}>
              Compare
            </a>
            <a href="/ownership-cost" style={navLinkStyle}>
              Ownership Cost
            </a>
            <a href="/deal-review" style={navLinkStyle}>
              Deal Review
            </a>
            <a href="/car-payment/30000" style={navLinkStyle}>
              Payments
            </a>
            <a href="/income-needed/30000" style={navLinkStyle}>
              Income Needed
            </a>
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

            <div
              style={{
                display: "flex",
                gap: "18px",
                flexWrap: "wrap",
              }}
            >
              <a href="/" style={navLinkStyle}>
                Home
              </a>
              <a href="/compare" style={navLinkStyle}>
                Compare Cars
              </a>
              <a href="/ownership-cost" style={navLinkStyle}>
                Ownership Cost
              </a>
              <a href="/deal-review" style={navLinkStyle}>
                Deal Review
              </a>
              <a href="/car-payment/30000" style={navLinkStyle}>
                Payments
              </a>
              <a href="/income-needed/30000" style={navLinkStyle}>
                Income Needed
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}