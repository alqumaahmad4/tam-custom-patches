"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  navigationGroups,
  productNavigationGroups,
  productsMegaMenuActions,
  type NavigationGroup,
  type NavigationLink,
  type ProductMegaMenuAction,
  type ProductNavigationGroup,
} from "@/lib/navigation";
import { getLinkPrefetch } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type DesktopMegaMenuProps = {
  pathname: string;
  isSolid: boolean;
};

const openDelayMs = 150;
const closeDelayMs = 150;

function isPathMatch(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function getIsActive(pathname: string, group: NavigationGroup) {
  return [group.href, ...(group.activeHrefs ?? [])].some((href) => isPathMatch(pathname, href));
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
      className="hidden flex-1 justify-center xl:flex"
      onPointerEnter={() => clearTimer(closeTimerRef)}
      onPointerLeave={scheduleClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          scheduleClose();
        }
      }}
    >
      <nav aria-label="Main navigation">
        <ul className="flex items-center gap-4 min-[1400px]:gap-6">
          {navigationGroups.map((group, index) => {
            const isOpen = openGroupId === group.id;
            const isActive = getIsActive(pathname, group);
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
                    "rounded-sm py-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none",
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
          {openGroup.id === "products" ? (
            <ProductsMegaMenu onNavigate={() => closeMenu(false)} />
          ) : (
            <SimpleMegaMenu group={openGroup} onNavigate={() => closeMenu(false)} />
          )}
        </div>
      ) : null}
    </div>
  );
}

function ProductsMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mx-auto max-h-[calc(100svh-5rem)] max-w-[var(--container-2xl)] overflow-y-auto px-8 py-6 lg:px-10">
      <div className="grid gap-4 min-[1400px]:grid-cols-5 xl:grid-cols-4">
        {productNavigationGroups.map((group) => (
          <ProductGroupColumn key={group.id} group={group} onNavigate={onNavigate} />
        ))}
      </div>
      <div className="border-border mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        {productsMegaMenuActions.map((action) => (
          <ProductMegaMenuActionLink key={action.href} action={action} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function ProductGroupColumn({
  group,
  onNavigate,
}: {
  group: ProductNavigationGroup;
  onNavigate: () => void;
}) {
  return (
    <section aria-labelledby={`products-group-${group.id}`} className="min-w-0">
      <h2
        id={`products-group-${group.id}`}
        className="text-muted-foreground mb-3 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase"
      >
        {group.label}
      </h2>
      <ul className="space-y-1">
        {group.links.map((link) => (
          <li key={`${group.id}-${link.href}-${link.label}`}>
            <Link
              href={link.href}
              prefetch={getLinkPrefetch(link.href)}
              className="hover:bg-secondary hover:text-primary flex min-h-10 items-center rounded-md px-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none"
              onClick={onNavigate}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li className="border-border mt-2 border-t pt-2">
          <Link
            href={group.href}
            prefetch={getLinkPrefetch(group.href)}
            className="text-primary hover:bg-secondary flex min-h-10 items-center rounded-md px-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none"
            onClick={onNavigate}
          >
            {group.viewAllLabel}
          </Link>
        </li>
      </ul>
    </section>
  );
}

function ProductMegaMenuActionLink({
  action,
  onNavigate,
}: {
  action: ProductMegaMenuAction;
  onNavigate: () => void;
}) {
  if (action.variant === "primary") {
    return (
      <Button asChild variant="premiumPrimary">
        <Link href={action.href} prefetch={getLinkPrefetch(action.href)} onClick={onNavigate}>
          {action.label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Button>
    );
  }

  if (action.variant === "secondary") {
    return (
      <Button asChild variant="premiumOutline">
        <Link href={action.href} prefetch={getLinkPrefetch(action.href)} onClick={onNavigate}>
          {action.label}
        </Link>
      </Button>
    );
  }

  return (
    <Link
      href={action.href}
      prefetch={getLinkPrefetch(action.href)}
      className="text-primary inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-semibold transition-colors duration-150 hover:underline focus-visible:outline-none"
      onClick={onNavigate}
    >
      {action.label}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}

function SimpleMegaMenu({ group, onNavigate }: { group: NavigationGroup; onNavigate: () => void }) {
  return (
    <div className="mx-auto max-h-[calc(100svh-5rem)] max-w-[var(--container-lg)] overflow-y-auto px-8 py-6 lg:px-10">
      <div className="mb-5 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-base font-semibold">{group.label}</h2>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
            {group.description}
          </p>
        </div>
        <Link
          href={group.href}
          prefetch={getLinkPrefetch(group.href)}
          className="text-primary hidden min-h-10 shrink-0 items-center gap-2 rounded-md text-sm font-semibold hover:underline focus-visible:outline-none md:inline-flex"
          onClick={onNavigate}
        >
          {group.label} overview
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {group.links.map((link) => (
          <SimpleMegaMenuLink
            key={`${group.id}-${link.href}-${link.label}`}
            link={link}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
}

function SimpleMegaMenuLink({
  link,
  onNavigate,
}: {
  link: NavigationLink;
  onNavigate: () => void;
}) {
  const Icon = link.icon;

  return (
    <li>
      <Link
        href={link.href}
        prefetch={getLinkPrefetch(link.href)}
        className="hover:bg-secondary group flex min-h-14 items-start gap-3 rounded-md p-3 transition-colors duration-150 focus-visible:outline-none"
        onClick={onNavigate}
      >
        {Icon ? (
          <span className="bg-tag-bg text-primary mt-0.5 grid size-9 shrink-0 place-items-center rounded-md">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        ) : null}
        <span className="min-w-0">
          <span className="group-hover:text-primary block text-sm font-semibold">{link.label}</span>
          {link.description ? (
            <span className="text-muted-foreground mt-1 block text-xs leading-5">
              {link.description}
            </span>
          ) : null}
        </span>
      </Link>
    </li>
  );
}
