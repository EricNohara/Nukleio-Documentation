"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_NUKLEIO_APP_URL ?? "http://localhost:3000";

const STORAGE_KEY = "nukleio-docs-return-to";

function isSafeInternalPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

export function ReturnToNukleio() {
  const searchParams = useSearchParams();
  const requestedPath = searchParams.get("returnTo");

  const safeRequestedPath =
    requestedPath && isSafeInternalPath(requestedPath) ? requestedPath : null;

  useEffect(() => {
    if (safeRequestedPath) {
      sessionStorage.setItem(STORAGE_KEY, safeRequestedPath);
    }
  }, [safeRequestedPath]);

  function getReturnUrl(): string {
    const storedPath = sessionStorage.getItem(STORAGE_KEY);

    const returnPath =
      safeRequestedPath ??
      (storedPath && isSafeInternalPath(storedPath) ? storedPath : "/");

    return new URL(returnPath, APP_ORIGIN).toString();
  }

  return (
    <a
      href={new URL(safeRequestedPath ?? "/", APP_ORIGIN).toString()}
      onClick={(event) => {
        event.preventDefault();
        window.location.href = getReturnUrl();
      }}
      className="nextra-focus x:group x:inline-flex x:items-center x:gap-1.5 x:rounded-md x:px-2 x:py-1.5 x:text-sm x:font-medium x:transition-colors x:hover:bg-gray-100 x:dark:hover:bg-neutral-800"
      aria-label="Return to Nukleio"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="x:transition-transform x:group-hover:-translate-x-0.5"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>

      <span>Return to Nukleio</span>
    </a>
  );
}
