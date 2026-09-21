export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://visionforgev2.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "VisionForge";

export const PUBLIC_PAGES = ["/", "/create", "/gallery", "/about"];
