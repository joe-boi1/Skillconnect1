// Tiny local classnames joiner — avoids adding a dependency just for this.
export function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
