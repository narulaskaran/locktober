import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Suspense } from "react";
import { CopyProvider } from "@/components/copy-provider";
import { MinionToggle } from "@/components/minion-toggle";
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
          <Suspense fallback={<div className="min-h-screen" />}>
            <VoicedShell>{children}</VoicedShell>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}

async function VoicedShell({ children }: { children: React.ReactNode }) {
  const { copy, minion } = await getVoice();
  return (
    <CopyProvider copy={copy}>
      {children}
      <MinionToggle on={minion} label={minion ? copy.mode.exit : copy.mode.enter} />
    </CopyProvider>
  );
}
