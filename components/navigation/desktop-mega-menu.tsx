"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { navigationGroups, type NavigationGroup, type NavigationLink } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type DesktopMegaMenuProps = {
  pathname: string;
  isSolid: boolean;
};

const openDelayMs = 150;
const closeDelayMs = 150;

function getIsActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function DesktopMegaMenu({ pathname, isSolid }: DesktopMegaMenuProps) {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lastTriggerIndexRef = useRef(0);
  const openGroup = navigationGroups.find((group) => group.id === openGroupId) as
    NavigationGroup | undefined;

  const clearTimer = useCallback((timerRef: typeof openTimerRef) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearTimers = useCallback(() => {
    clearTimer(openTimerRef);
    clearTimer(closeTimerRef);
  }, [clearTimer]);

  function openMenu(groupId: string, triggerIndex: number, delayed = true) {
    clearTimers();
    lastTriggerIndexRef.current = triggerIndex;

    if (!delayed) {
      setOpenGroupId(groupId);
      return;
    }

    openTimerRef.current = window.setTimeout(() => {
      setOpenGroupId(groupId);
    }, openDelayMs);
  }

  const closeMenu = useCallback(
    (restoreFocus = false) => {
      clearTimers();
      setOpenGroupId(null);

      if (restoreFocus) {
        triggerRefs.current[lastTriggerIndexRef.current]?.focus();
      }
    },
    [clearTimers],
  );

  function scheduleClose() {
    clearTimer(openTimerRef);
    clearTimer(closeTimerRef);
    closeTimerRef.current = window.setTimeout(() => {
      setOpenGroupId(null);
    }, closeDelayMs);
  }

  function focusTrigger(index: number) {
    const nextIndex = (index + navigationGroups.length) % navigationGroups.length;
    triggerRefs.current[nextIndex]?.focus();
  }

  function focusFirstMenuLink() {
    window.setTimeout(() => {
      const firstLink = rootRef.current?.querySelector<HTMLAnchorElement>(
        "[data-mega-menu-panel] a",
      );
      firstLink?.focus();
    }, 0);
  }

  useEffect(() => {
    if (!openGroupId) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, openGroupId]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <div
      ref={rootRef}
      className="hidden flex-1 justify-center lg:flex"
      onPointerEnter={() => clearTimer(closeTimerRef)}
      onPointerLeave={scheduleClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          scheduleClose();
        }
      }}
    >
      <nav aria-label="Main navigation">
        <ul className="flex items-center gap-6 xl:gap-8">
          {navigationGroups.map((group, index) => {
            const isOpen = openGroupId === group.id;
            const isActive = getIsActive(pathname, group.href);
            const panelId = `mega-menu-${group.id}`;

            return (
              <li key={group.id}>
                <button
                  ref={(node) => {
                    triggerRefs.current[index] = node;
                  }}
                  type="button"
                  aria-controls={panelId}
                  aria-current={isActive ? "page" : undefined}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={cn(
                    "rounded-sm py-2 text-[15px] font-medium transition-colors duration-150 focus-visible:outline-none",
                    isActive ? "font-semibold underline underline-offset-8" : null,
                    isSolid
                      ? "text-foreground/85 hover:text-primary"
                      : "text-surface/90 hover:text-surface",
                  )}
                  onPointerEnter={() => openMenu(group.id, index)}
                  onClick={() => (isOpen ? closeMenu(false) : openMenu(group.id, index, false))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openMenu(group.id, index, false);
                    }

                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      focusTrigger(index + 1);
                    }

                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      focusTrigger(index - 1);
                    }

                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      openMenu(group.id, index, false);
                      focusFirstMenuLink();
                    }
                  }}
                >
                  {group.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {openGroup ? (
        <div
          id={`mega-menu-${openGroup.id}`}
          data-mega-menu-panel
          role="region"
          aria-label={`${openGroup.label} submenu`}
          className="border-border bg-background absolute inset-x-0 top-full z-[var(--z-dropdown)] border-y shadow-lg"
          onPointerEnter={() => clearTimer(closeTimerRef)}
          onPointerLeave={scheduleClose}
        >
          <div className="mx-auto grid max-h-[480px] max-w-[var(--container-xl)] grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_220px] gap-8 overflow-y-auto px-10 py-8">
            <MegaMenuColumn title={openGroup.label} links={openGroup.productLinks} />
            <MegaMenuColumn title="By Industry" links={openGroup.industryLinks} compact />
            <MegaMenuColumn title="Tools & Resources" links={openGroup.resourceLinks} compact />
            <aside className="bg-section-bg rounded-lg border p-5">
              <p className="text-primary mb-3 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
                Featured
              </p>
              {openGroup.featured ? (
                <Link
                  href={openGroup.featured.href}
                  className="group block rounded-md focus-visible:outline-none"
                  onClick={() => closeMenu(false)}
                >
                  <span className="bg-primary/10 text-primary mb-4 grid size-12 place-items-center rounded-lg">
                    {openGroup.featured.icon ? (
                      <openGroup.featured.icon aria-hidden={true} className="size-5" />
                    ) : (
                      <ArrowRight aria-hidden={true} className="size-5" />
                    )}
                  </span>
                  <span className="block text-base font-semibold">{openGroup.featured.label}</span>
                  <span className="text-muted-foreground mt-2 block text-sm leading-6">
                    {openGroup.featured.description ?? openGroup.description}
                  </span>
                  <span className="text-primary mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                    Explore
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    />
                  </span>
                </Link>
              ) : null}
            </aside>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MegaMenuColumn({
  title,
  links,
  compact = false,
}: {
  title: string;
  links: readonly NavigationLink[];
  compact?: boolean;
}) {
  return (
    <div>
      <h2 className="text-muted-foreground mb-4 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
        {title}
      </h2>
      <ul className={compact ? "space-y-2" : "space-y-3"}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group hover:bg-secondary flex min-h-11 items-start gap-3 rounded-lg p-2 transition-colors duration-150 focus-visible:outline-none"
            >
              {link.icon ? (
                <span className="bg-tag-bg text-primary mt-0.5 grid size-9 shrink-0 place-items-center rounded-md">
                  <link.icon aria-hidden={true} className="size-4" />
                </span>
              ) : null}
              <span>
                <span className="group-hover:text-primary block text-sm font-semibold">
                  {link.label}
                </span>
                {!compact && link.description ? (
                  <span className="text-muted-foreground mt-1 block text-xs leading-5">
                    {link.description}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
