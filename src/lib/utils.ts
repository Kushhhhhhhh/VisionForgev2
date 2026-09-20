import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  const { maxAttempts = 3, baseDelayMs = 1000, label = "operation" } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isLast = attempt === maxAttempts;
      const isRetryable = !err.message?.includes("Invalid API Key") &&
                          !err.message?.includes("Unauthorized");

      console.warn(`[RETRY] ${label} attempt ${attempt}/${maxAttempts} failed: ${err.message}`);

      if (isLast || !isRetryable) throw err;

      const delay = baseDelayMs * Math.pow(2, attempt - 1); // 1s, 2s, 4s...
      console.log(`[RETRY] Waiting ${delay}ms before retry...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("Unreachable");
}