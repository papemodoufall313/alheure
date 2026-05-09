export function artImgSrc(seed: string, url: string | undefined, w: number, h: number) {
  return url || `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export function picsumFallback(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export function isLocalPath(src: string) {
  return src.startsWith("/") || !src.includes("picsum.photos");
}
