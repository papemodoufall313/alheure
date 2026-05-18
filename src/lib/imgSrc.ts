export function artImgSrc(_seed: string, url: string | undefined, _w: number, _h: number) {
  return url || "/placeholder.svg";
}

export function picsumFallback(_seed: string, _w: number, _h: number) {
  return "/placeholder.svg";
}

export function isLocalPath(src: string) {
  return src.startsWith("/") || !src.includes("picsum.photos");
}
