import type { KeyboardEvent } from "react";

const forwardKeys = new Set(["ArrowRight", "ArrowDown"]);
const backwardKeys = new Set(["ArrowLeft", "ArrowUp"]);

export function handleRadioGroupArrowNavigation(event: KeyboardEvent<HTMLElement>) {
  if (!forwardKeys.has(event.key) && !backwardKeys.has(event.key)) {
    return;
  }

  const currentRadio = (event.target as HTMLElement).closest<HTMLElement>('[role="radio"]');
  const radios = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      '[role="radio"]:not([aria-disabled="true"]):not([disabled])',
    ),
  );
  const currentIndex = currentRadio ? radios.indexOf(currentRadio) : -1;

  if (currentIndex === -1) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const direction = forwardKeys.has(event.key) ? 1 : -1;
  const nextIndex = (currentIndex + direction + radios.length) % radios.length;
  const nextRadio = radios[nextIndex];

  nextRadio?.focus();
  nextRadio?.click();
}
