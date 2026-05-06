// Image helper.
//
// Supabase Storage's image-transform endpoint (`/render/image/public/`)
// requires the Pro plan. On the free tier it returns 400 and images
// silently break. So we default to returning the ORIGINAL URL and only
// rewrite when explicitly enabled via VITE_SUPABASE_IMAGE_TRANSFORM=1.

const PUBLIC_PATH = "/storage/v1/object/public/";
const RENDER_PATH = "/storage/v1/render/image/public/";

const TRANSFORM_ENABLED =
  typeof import.meta !== "undefined" &&
  import.meta.env?.VITE_SUPABASE_IMAGE_TRANSFORM === "1";

export interface ImgOpts {
  width?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
}

export function optimizeImage(url: string | null | undefined, opts: ImgOpts = {}): string {
  if (!url) return "";
  if (!TRANSFORM_ENABLED) return url;
  if (!url.includes(PUBLIC_PATH)) return url;
  const { width = 800, quality = 75, resize = "cover" } = opts;
  const transformed = url.replace(PUBLIC_PATH, RENDER_PATH);
  const sep = transformed.includes("?") ? "&" : "?";
  return `${transformed}${sep}width=${width}&quality=${quality}&resize=${resize}`;
}

export function srcSet(url: string | null | undefined, widths: number[], quality = 75): string {
  if (!url) return "";
  if (!TRANSFORM_ENABLED) return ""; // browser will use plain `src`
  return widths
    .map((w) => `${optimizeImage(url, { width: w, quality })} ${w}w`)
    .join(", ");
}
