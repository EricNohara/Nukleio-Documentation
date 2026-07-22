import "nextra-theme-docs/style.css";

import { Analytics } from "@vercel/analytics/next";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Suspense } from "react";

import { NukleioDocumentationTitle } from "./components/NukleioDocumentationTitle";
import { NukleioSearch } from "./components/NukleioSearch";
import { ReturnToNukleio } from "./components/ReturnToNukleio";
import { baseFont } from "./localFonts";

export const metadata = {
  title: "Nukleio Documentation",
  description: "Documentation for Nukleio",
};

const navbar = (
  <Navbar logo={<NukleioDocumentationTitle />}>
    <Suspense fallback={null}>
      <ReturnToNukleio />
    </Suspense>
  </Navbar>
);
const footer = <Footer>&copy; 2026 Nukleio Docs</Footer>;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={baseFont.className}
    >
      <head>
        <link rel="icon" href="/icons/favicon-v2.ico" sizes="any" />
        <link rel="icon" href="/icons/favicon-v2.svg" type="image/svg+xml" />
        <link
          rel="preload"
          href="/fonts/baseFont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/titleFont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
          docsRepositoryBase="https://github.com/EricNohara/Nukleio-Documentation/"
          search={<NukleioSearch />}
        >
          {children}
          <Analytics />
        </Layout>
      </body>
    </html>
  );
}

