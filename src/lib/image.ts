// Supabase Storage image-transform helper.
// If the URL is a Supabase public object URL, rewrite it to /render/image/public/
// with width + quality params for fast, responsive loading.
// Falls back to the original URL otherwise.

const PUBLIC_PATH = "/storage/v1/object/public/";
const RENDER_PATH = "/storage/v1/render/image/public/";

export interface ImgOpts {
  width?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
}

export function optimizeImage(url: string | null | undefined, opts: ImgOpts = {}): string {
  if (!url) return "";
  if (!url.includes(PUBLIC_PATH)) return url;
  const { width = 800, quality = 75, resize = "cover" } = opts;
  const transformed = url.replace(PUBLIC_PATH, RENDER_PATH);
  const sep = transformed.includes("?") ? "&" : "?";
  return `${transformed}${sep}width=${width}&quality=${quality}&resize=${resize}`;
}

export function srcSet(url: string | null | undefined, widths: number[], quality = 75): string {
  if (!url) return "";
  return widths
    .map((w) => `${optimizeImage(url, { width: w, quality })} ${w}w`)
    .join(", ");
}
