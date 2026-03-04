import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taaza — Premium Arabic Fusion Restaurant",
  description:
    "Experience the art of Arabic fusion cuisine. Taaza blends ancient Levantine traditions with contemporary culinary technique, curated in an atmosphere of understated luxury.",
  keywords: ["Arabic restaurant", "fusion cuisine", "Taaza", "fine dining", "Levantine food"],
  openGraph: {
    title: "Taaza — Premium Arabic Fusion Restaurant",
    description: "An immersive culinary journey through Arabic fusion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Cinematic overlays */}
        <div className="grain-overlay" aria-hidden="true" />
        <div className="scanline-overlay" aria-hidden="true" />
        {/* overflow-x:clip constrains horizontal overflow without breaking position:sticky */}
        <div style={{ overflowX: "clip" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
