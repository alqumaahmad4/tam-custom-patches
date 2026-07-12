"use client";

import { useRef, type DragEvent } from "react";
import { useFormContext } from "react-hook-form";
import { FileText, UploadCloud, X } from "lucide-react";

import { supportedArtworkExtensions } from "@/features/quote-wizard/data";
import type { QuoteArtworkFile } from "@/features/quote-wizard/types";
import type { QuoteWizardValues } from "@/features/quote-wizard/validation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function toArtworkFile(file: File): QuoteArtworkFile {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }

  return `${Math.round(size / (1024 * 1024))}MB`;
}

function hasSupportedExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  return supportedArtworkExtensions.includes(
    extension as (typeof supportedArtworkExtensions)[number],
  );
}

export function ArtworkStep() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    clearErrors,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useFormContext<QuoteWizardValues>();
  const files = watch("artworkFiles");
  const artworkStatus = watch("artworkStatus");
  const artworkError = errors.artworkFiles ?? errors.artworkStatus;
  const artworkErrorId = artworkError
    ? `quote-error-${errors.artworkFiles ? "artworkFiles" : "artworkStatus"}`
    : undefined;

  function setFiles(fileList: FileList | File[]) {
    const nextFiles = Array.from(fileList);
    const unsupported = nextFiles.find((file) => !hasSupportedExtension(file));

    if (unsupported) {
      setError("artworkFiles", {
        type: "validate",
        message: "Supported formats: AI, EPS, PDF, SVG, PNG, and JPG.",
      });
      return;
    }

    setValue("artworkFiles", nextFiles.map(toArtworkFile).slice(0, 5), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("artworkStatus", "uploaded", {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors(["artworkFiles", "artworkStatus"]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  }

  return (
    <div>
      {artworkError ? (
        <p id={artworkErrorId} role="alert" className="text-destructive mb-4 text-sm font-medium">
          {artworkError.message}
        </p>
      ) : null}

      <div
        data-quote-field={errors.artworkFiles ? "artworkFiles" : "artworkStatus"}
        aria-describedby={artworkErrorId}
        className={cn(
          "border-border bg-card flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors duration-200",
          artworkStatus === "uploaded" ? "border-primary bg-tag-bg" : null,
        )}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <UploadCloud aria-hidden="true" className="text-primary size-10" />
        <h3 className="mt-4 text-xl font-semibold">Drag and drop artwork</h3>
        <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
          Supported formats: AI, EPS, PDF, SVG, PNG, and JPG. Files stay in this browser session.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={() => inputRef.current?.click()}>
            Browse
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setValue("artworkStatus", "later", {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue("artworkFiles", [], {
                shouldDirty: true,
                shouldValidate: true,
              });
              clearErrors(["artworkStatus", "artworkFiles"]);
            }}
          >
            Send artwork later
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          aria-label="Browse artwork files"
          accept=".ai,.eps,.pdf,.svg,.png,.jpg,.jpeg"
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
        />
      </div>

      {artworkStatus === "later" ? (
        <p className="bg-warning-light text-foreground mt-4 rounded-lg p-4 text-sm">
          Artwork marked for later. The quote summary will show that files are still needed.
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="mt-5 space-y-2" aria-label="Selected artwork files">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              className="border-border bg-card flex min-h-14 items-center gap-3 rounded-lg border px-4"
            >
              <FileText aria-hidden="true" className="text-primary size-5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{file.name}</span>
                <span className="text-muted-foreground text-xs">{formatFileSize(file.size)}</span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="hover:bg-secondary grid size-10 place-items-center rounded-full transition-colors duration-150 focus-visible:outline-none"
                onClick={() => {
                  const nextFiles = files.filter((item) => item.name !== file.name);

                  setValue("artworkFiles", nextFiles, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue("artworkStatus", nextFiles.length > 0 ? "uploaded" : "notStarted", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
