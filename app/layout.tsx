import "nextra-theme-docs/style.css";

import { Analytics } from "@vercel/analytics/next";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";

export const metadata = {
  title: "Nukleio Documentation",
  description: "Documentation for Nukleio",
};

const navbar = <Navbar logo={<b>Nukleio Documentation</b>} />;
const footer = <Footer>© 2026 Nukleio Docs</Footer>;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
          docsRepositoryBase="https://github.com/EricNohara/Nukleio-Documentation/"
        >
          {children}
          <Analytics />
        </Layout>
      </body>
    </html>
  );
}
