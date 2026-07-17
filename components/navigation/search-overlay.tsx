"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";

import {
  designPricingLinks,
  guidesSupportLinks,
  popularSearches,
  searchIndex,
  type SearchContentType,
  type SearchIndexItem,
} from "@/lib/navigation";
import { routes } from "@/lib/site-config";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const contentTypes = [
  "Products",
  "Product groups",
  "Industries",
  "Design & Pricing",
  "Guides & Support",
  "About",
  "Blog",
] as const satisfies readonly SearchContentType[];

function matchesQuery(item: SearchIndexItem, query: string) {
  const searchable = [item.label, item.description ?? "", ...item.keywords].join(" ").toLowerCase();

  return searchable.includes(query.toLowerCase());
}

function groupResults(results: readonly SearchIndexItem[]) {
  return contentTypes.map((type) => ({
    type,
    items: results.filter((item) => item.type === type),
  }));
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const normalizedQuery = query.trim();
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return searchIndex.filter((item) => matchesQuery(item, normalizedQuery)).slice(0, 12);
  }, [normalizedQuery]);
  const groupedResults = groupResults(results);
  const selectedResult = results[selectedIndex];

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    }

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
      return;
    }

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function openResult(item: SearchIndexItem) {
    onOpenChange(false);
    router.push(item.href);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setSelectedIndex((current) => (current + 1) % results.length);
    }

    if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setSelectedIndex((current) => (current - 1 + results.length) % results.length);
    }

    if (event.key === "Enter" && selectedResult) {
      event.preventDefault();
      openResult(selectedResult);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-0 left-0 h-dvh max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 p-0 sm:rounded-none">
        <div className="mx-auto flex min-h-dvh max-w-[var(--container-xl)] flex-col px-4 pt-24 pb-8 sm:px-6 lg:px-10">
          <DialogTitle className="sr-only">Search Tam Custom Patches</DialogTitle>
          <DialogDescription className="sr-only">
            Search products, industries, design and pricing, guides and support, about pages, and
            blog articles.
          </DialogDescription>

          <div className="mx-auto w-full max-w-3xl">
            <div className="border-border bg-surface flex min-h-[56px] items-center gap-3 rounded-lg border px-4 shadow-lg">
              <Search aria-hidden="true" className="text-muted-foreground size-5 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                type="search"
                aria-label="Search products, industries, design and pricing, guides and support, about pages, and blog"
                placeholder="Search for what you need"
                className="min-h-[52px] flex-1 bg-transparent text-base outline-none"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="hover:bg-secondary grid size-10 place-items-center rounded-full transition-colors duration-150 focus-visible:outline-none"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              ) : null}
            </div>

            {!normalizedQuery ? <SearchEmptyState onSelect={setQuery} /> : null}

            {normalizedQuery && results.length === 0 ? (
              <SearchNoResults query={normalizedQuery} onSelect={setQuery} />
            ) : null}

            {results.length > 0 ? (
              <div className="mt-8 grid gap-6 lg:grid-cols-4">
                {groupedResults.map((group) => (
                  <SearchResultGroup
                    key={group.type}
                    groupType={group.type}
                    items={group.items}
                    results={results}
                    selectedIndex={selectedIndex}
                    onSelect={openResult}
                    onHighlight={setSelectedIndex}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchEmptyState({ onSelect }: { onSelect: (query: string) => void }) {
  return (
    <div className="mt-8">
      <p className="text-muted-foreground text-sm">Popular searches</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {popularSearches.map((term) => (
          <button
            key={term}
            type="button"
            className="border-border hover:bg-secondary min-h-11 rounded-md border px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none"
            onClick={() => onSelect(term)}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

function SearchNoResults({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (query: string) => void;
}) {
  return (
    <div className="mt-10 rounded-lg border p-6">
      <div className="bg-tag-bg text-primary mb-5 grid size-14 place-items-center rounded-full">
        <Search aria-hidden="true" className="size-6" />
      </div>
      <p className="text-xl font-semibold">No results for &quot;{query}&quot;</p>
      <p className="text-muted-foreground mt-2 text-sm">
        Try a different keyword or jump to one of the most common destinations.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { label: "Custom Patches", href: routes.customPatches },
          designPricingLinks[0],
          guidesSupportLinks[2],
        ].map((link) => (
          <button
            key={link.href}
            type="button"
            className="border-border hover:bg-secondary min-h-11 rounded-md border px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none"
            onClick={() => onSelect(link.label)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SearchResultGroup({
  groupType,
  items,
  results,
  selectedIndex,
  onSelect,
  onHighlight,
}: {
  groupType: SearchContentType;
  items: readonly SearchIndexItem[];
  results: readonly SearchIndexItem[];
  selectedIndex: number;
  onSelect: (item: SearchIndexItem) => void;
  onHighlight: (index: number) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`search-group-${groupType}`}>
      <h2
        id={`search-group-${groupType}`}
        className="text-muted-foreground mb-3 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase"
      >
        {groupType}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => {
          const resultIndex = results.findIndex((result) => result.href === item.href);
          const isSelected = resultIndex === selectedIndex;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <button
                type="button"
                className={cn(
                  "flex min-h-14 w-full items-start gap-3 rounded-lg p-3 text-left transition-colors duration-150 focus-visible:outline-none",
                  isSelected ? "bg-tag-bg text-primary" : "hover:bg-secondary text-foreground",
                )}
                aria-current={isSelected ? "true" : undefined}
                onMouseEnter={() => onHighlight(resultIndex)}
                onFocus={() => onHighlight(resultIndex)}
                onClick={() => onSelect(item)}
              >
                {Icon ? (
                  <span className="bg-surface grid size-9 shrink-0 place-items-center rounded-md border">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  {item.description ? (
                    <span className="text-muted-foreground mt-1 block text-xs leading-5">
                      {item.description}
                    </span>
                  ) : null}
                </span>
                <ArrowRight aria-hidden="true" className="ml-auto size-4 shrink-0" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
