"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { clsx } from "@/lib/clsx";

// Converts a selected file to a base64 data URL and keeps it in a hidden
// form field so it submits as a normal string with everything else in the
// enclosing <form>/Server Action. No external storage is wired up yet — see
// README for swapping this to real object storage (S3/Cloudinary) later.
export function ImageUpload({
  name,
  label,
  defaultValue,
  shape = "square",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  shape?: "square" | "circle";
}) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>
      <input type="hidden" name={name} value={preview ?? ""} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "flex items-center justify-center overflow-hidden border border-dashed border-line bg-paper text-ink/40",
          shape === "circle" ? "h-20 w-20 rounded-full" : "aspect-video w-full rounded-xl"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 p-3 text-center text-xs">
            <ImagePlus size={20} />
            Tap to upload
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-1.5 text-sm text-coral-500">{error}</p>}
    </div>
  );
}
