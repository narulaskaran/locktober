import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { CopyProvider } from "@/components/copy-provider";
import { InstallPrompt, ServiceWorkerRegistrar } from "@/components/install-prompt";
import { MinionToggle } from "@/components/minion-toggle";
import { MonthIconSprite } from "@/components/month-icon";
import { THEME_SCRIPT } from "@/lib/themes";
import { getVoice } from "@/lib/voice";
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

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getVoice();
  return {
    title: {
      default: copy.meta.title,
      template: copy.meta.titleTemplate,
    },
    description: copy.meta.description,
    appleWebApp: { capable: true, title: copy.brand, statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  // The theme script swaps this for the month's paper color in the browser.
  themeColor: "#efe8dc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The theme script sets data-theme before React hydrates.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <MonthIconSprite />
        <ClerkProvider
          appearance={{
            // Text and neutrals stay fixed (every theme's ink is near-black).
            // Surfaces go through `elements` so they can follow the theme.
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
                backgroundColor: "var(--paper-2)",
                border: "1px solid var(--ink)",
                borderRadius: "0px",
                boxShadow: "3px 3px 0 var(--ink)",
              },
              header: { display: "none" },
              socialButtonsBlockButton: { borderRadius: "0px" },
              formButtonPrimary: {
                borderRadius: "0px",
                backgroundColor: "var(--ink)",
                color: "var(--paper)",
              },
              formFieldInput: { borderRadius: "0px", backgroundColor: "var(--paper)" },
              footer: { background: "var(--paper-2)" },
            },
          }}
        >
          <Suspense fallback={<div className="min-h-screen" />}>
            <VoicedShell>{children}</VoicedShell>
          </Suspense>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}

async function VoicedShell({ children }: { children: React.ReactNode }) {
  const { copy, minion } = await getVoice();
  return (
    <CopyProvider copy={copy}>
      {children}
      <InstallPrompt />
      <MinionToggle on={minion} label={minion ? copy.mode.exit : copy.mode.enter} />
      <ServiceWorkerRegistrar />
    </CopyProvider>
  );
}
