import Image from "next/image";

import { titleFont } from "../localFonts";

export function NukleioDocumentationTitle() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "1rem",
        whiteSpace: "nowrap",
      }}
    >
      <Image
        src="/icons/favicon-v2.svg"
        alt="Nukleio Logo"
        width={32}
        height={32}
        style={{ flexShrink: 0 }}
      />

      <h1 className={titleFont.className}>Nukleio Documentation</h1>
    </span>
  );
}
