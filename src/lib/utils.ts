import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalises an Indian mobile number to E.164 format (+91XXXXXXXXXX).
 * Handles all common user inputs:
 *   "7827734471"      → "+917827734471"
 *   "917827734471"    → "+917827734471"
 *   "+917827734471"   → "+917827734471"
 *   "+91 7827734471"  → "+917827734471"
 *   "07827734471"     → "+917827734471"
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  // best-effort fallback – return with + prefix
  return `+${digits}`;
}
