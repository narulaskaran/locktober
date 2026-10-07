import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Loctober",
    template: "%s · Loctober",
  },
  description:
    "A private scoreboard for a month-long lock-in. Daily volume, a running total, and one finale.",
  appleWebApp: { capable: true, title: "Loctober", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#efe8dc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#1c1712",
              colorBackground: "#f6f1e7",
              colorForeground: "#1c1712",
              colorInput: "#efe8dc",
              colorInputForeground: "#1c1712",
              colorNeutral: "#1c1712",
              borderRadius: "0px",
              fontFamily: "var(--font-geist-sans), sans-serif",
            },
            elements: {
              card: {
                border: "1px solid #1c1712",
                borderRadius: "0px",
                boxShadow: "3px 3px 0 #1c1712",
              },
              header: { display: "none" },
              socialButtonsBlockButton: { borderRadius: "0px" },
              formButtonPrimary: { borderRadius: "0px" },
              formFieldInput: { borderRadius: "0px" },
              footer: { background: "#f6f1e7" },
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
