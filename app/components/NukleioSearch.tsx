"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import cn from "clsx";
import { addBasePath } from "next/dist/client/add-base-path";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";

type PagefindResult = {
  data: () => Promise<PagefindData>;
};

type PagefindData = {
  meta: {
    title?: string;
  };
  sub_results: Array<{
    title: string;
    excerpt: string;
    url: string;
  }>;
};

type SearchResult = PagefindData["sub_results"][number];

type Pagefind = {
  debouncedSearch: (
    value: string,
    options?: Record<string, unknown>,
  ) => Promise<{ results: PagefindResult[] } | null>;
  options: (options: { baseUrl: string }) => Promise<void>;
};

declare global {
  interface Window {
    pagefind?: Pagefind;
  }
}

const inputs = new Set(["INPUT", "SELECT", "BUTTON", "TEXTAREA"]);

async function importPagefind() {
  window.pagefind = await import(
    /* webpackIgnore: true */ addBasePath("/_pagefind/pagefind.js")
  );
  await window.pagefind.options({ baseUrl: "/" });
}

function normalizeResult(result: SearchResult): SearchResult {
  const url = result.url.replace(/\.html$/, "").replace(/\.html#/, "#");
  return { ...result, url };
}

export function NukleioSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [results, setResults] = useState<PagefindData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const element = document.activeElement;
      if (
        !element ||
        inputs.has(element.tagName) ||
        (element as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (
        event.key === "/" ||
        (event.key === "k" && !event.shiftKey && (navigator.userAgent.includes("Mac") ? event.metaKey : event.ctrlKey))
      ) {
        event.preventDefault();
        inputRef.current?.focus({ preventScroll: true });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runSearch() {
      if (!deferredSearch) {
        setResults([]);
        setError("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        if (!window.pagefind) {
          await importPagefind();
        }

        const response = await window.pagefind?.debouncedSearch(deferredSearch);
        if (!response || cancelled) return;

        const data = await Promise.all(response.results.map((result) => result.data()));
        if (cancelled) return;

        setResults(
          data.map((result) => ({
            ...result,
            sub_results: result.sub_results.map(normalizeResult),
          })),
        );
        setError("");
      } catch (searchError) {
        if (!cancelled) {
          setError(
            searchError instanceof Error
              ? searchError.message
              : "Failed to load search index.",
          );
          setResults([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [deferredSearch]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.currentTarget.value);
  }

  function handleSelect(result: SearchResult | null) {
    if (!result) return;

    inputRef.current?.blur();
    const [url, hash] = result.url.split("#");

    if (location.pathname === url && hash) {
      location.href = `#${hash}`;
    } else {
      router.push(result.url);
    }

    setSearch("");
  }

  return (
    <Combobox onChange={handleSelect}>
      <div className="nextra-search x:relative x:flex x:items-center x:text-gray-900 x:dark:text-gray-300 x:contrast-more:text-gray-800 x:contrast-more:dark:text-gray-300">
        <ComboboxInput
          ref={inputRef}
          spellCheck={false}
          autoComplete="off"
          type="search"
          value={search}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search documentation..."
          className={({ focus }) =>
            cn(
              "x:rounded-lg x:px-3 x:py-2 x:transition-all",
              "x:w-full x:md:w-64",
              "x:text-base x:leading-tight x:md:text-sm",
              focus
                ? "x:bg-transparent x:nextra-focus"
                : "x:bg-black/[.05] x:dark:bg-gray-50/10",
              "x:placeholder:text-gray-600 x:dark:placeholder:text-gray-400",
              "x:contrast-more:border x:contrast-more:border-current",
              "x:[&::-webkit-search-cancel-button]:appearance-none",
            )
          }
        />
        <kbd
          className={cn(
            "x:absolute x:my-1.5 x:select-none x:pointer-events-none x:end-1.5 x:transition-all",
            "x:h-5 x:rounded x:bg-nextra-bg x:px-1.5 x:font-mono x:text-[11px] x:font-medium x:text-gray-600 x:dark:text-gray-400",
            "x:border nextra-border",
            "x:contrast-more:text-current",
            "x:items-center x:gap-1 x:flex",
            "x:max-sm:hidden not-prose",
            focused && "x:invisible x:opacity-0",
          )}
        >
          CTRL K
        </kbd>
      </div>

      <ComboboxOptions
        transition
        anchor={{ to: "top end", gap: 10, padding: 16 }}
        className={cn(
          "nextra-search-results nextra-scrollbar x:max-md:h-full",
          "x:border x:border-gray-200 x:text-gray-100 x:dark:border-neutral-800",
          "x:z-30 x:rounded-xl x:py-2.5 x:shadow-xl",
          "x:contrast-more:border x:contrast-more:border-gray-900 x:contrast-more:dark:border-gray-50",
          "x:backdrop-blur-md x:bg-nextra-bg/70",
          "x:motion-reduce:transition-none",
          "x:origin-top x:transition x:duration-200 x:ease-out x:data-closed:scale-95 x:data-closed:opacity-0 x:empty:invisible",
          error || isLoading || !results.length
            ? "x:md:min-h-28 x:grow x:flex x:justify-center x:text-sm x:gap-2 x:px-8 x:items-center x:text-gray-400"
            : "x:md:max-h-[min(calc(100vh-5rem),400px)]!",
          "x:w-full x:md:w-[576px]",
        )}
      >
        {error ? (
          <div className="x:text-red-500">Failed to load search index: {error}</div>
        ) : isLoading ? (
          <div>Loading...</div>
        ) : results.length ? (
          results.map((result, index) => (
            <div key={`${result.meta.title ?? "result"}-${index}`}>
              <div className="x:mx-2.5 x:mb-2 x:not-first:mt-6 x:select-none x:border-b x:border-black/10 x:px-2.5 x:pb-1.5 x:text-xs x:font-semibold x:uppercase x:text-gray-600 x:dark:border-white/20 x:dark:text-gray-300 x:contrast-more:border-gray-600 x:contrast-more:text-gray-900 x:contrast-more:dark:border-gray-50 x:contrast-more:dark:text-gray-50">
                {result.meta.title}
              </div>
              {result.sub_results.map((subResult) => (
                <ComboboxOption
                  key={subResult.url}
                  as={NextLink}
                  value={subResult}
                  href={subResult.url}
                  className={({ focus }) =>
                    cn(
                      "x:mx-2.5 x:break-words x:rounded-md",
                      "x:contrast-more:border",
                      focus
                        ? "x:text-primary-600 x:contrast-more:border-current x:bg-primary-500/10"
                        : "x:text-gray-800 x:dark:text-gray-300 x:contrast-more:border-transparent",
                      "x:block x:scroll-m-12 x:px-2.5 x:py-2",
                    )
                  }
                >
                  <div className="x:text-base x:font-semibold x:leading-5">
                    {subResult.title}
                  </div>
                  <div
                    className="x:mt-1 x:text-sm x:leading-[1.35rem] x:text-gray-600 x:dark:text-gray-400 x:contrast-more:dark:text-gray-50 x:[&_mark]:bg-primary-600/80 x:[&_mark]:text-white"
                    dangerouslySetInnerHTML={{ __html: subResult.excerpt }}
                  />
                </ComboboxOption>
              ))}
            </div>
          ))
        ) : deferredSearch ? (
          <div>No results found.</div>
        ) : null}
      </ComboboxOptions>
    </Combobox>
  );
}



