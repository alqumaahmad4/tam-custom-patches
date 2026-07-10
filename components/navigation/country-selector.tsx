"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe2 } from "lucide-react";

import { countryOptions } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type CountrySelectorProps = {
  isSolid: boolean;
};

export function CountrySelector({ isSolid }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<(typeof countryOptions)[number]["code"]>("US");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedCountry = countryOptions.find((country) => country.code === selectedCode);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectCountry(code: typeof selectedCode) {
    setSelectedCode(code);
    document.cookie = `tam-country=${code}; path=/; max-age=31536000`;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div ref={rootRef} className="relative hidden lg:block">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Select country"
        aria-controls="country-selector-panel"
        aria-expanded={open}
        className={cn(
          "grid size-10 place-items-center rounded-full transition-colors duration-150 focus-visible:outline-none",
          isSolid
            ? "text-foreground/80 hover:bg-secondary hover:text-primary"
            : "text-surface/90 hover:bg-surface/10 hover:text-surface",
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <Globe2 aria-hidden="true" className="size-5" />
      </button>

      {open ? (
        <div
          id="country-selector-panel"
          className="border-border bg-background absolute top-full right-0 mt-3 w-72 rounded-lg border p-2 shadow-lg"
        >
          <p className="text-muted-foreground px-3 py-2 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
            Shipping region
          </p>
          <ul className="max-h-80 overflow-y-auto">
            {countryOptions.map((country) => {
              const isSelected = country.code === selectedCode;

              return (
                <li key={country.code}>
                  <button
                    type="button"
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm transition-colors duration-150 focus-visible:outline-none",
                      isSelected ? "bg-tag-bg text-primary" : "hover:bg-secondary text-foreground",
                    )}
                    onClick={() => selectCountry(country.code)}
                  >
                    <span>
                      <span className="font-medium">{country.label}</span>
                      <span className="text-muted-foreground ml-2">{country.currency}</span>
                    </span>
                    {isSelected ? <Check aria-hidden="true" className="size-4" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="text-muted-foreground px-3 pt-2 pb-1 text-xs">
            {selectedCountry?.label ?? "United States"} is used for display only.
          </p>
        </div>
      ) : null}
    </div>
  );
}
