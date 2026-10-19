import { ConvexError } from "convex/values";

/** The message to show for a failed Convex call. Server checks throw
    ConvexError with a plain sentence; anything else is unexpected. */
export function errorText(err: unknown) {
  if (err instanceof ConvexError && typeof err.data === "string") return err.data;
  return "Something went wrong. Try again in a minute.";
}
