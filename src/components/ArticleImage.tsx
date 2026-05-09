"use client";
import { useState } from "react";
import Image from "next/image";
import { picsumFallback } from "@/lib/imgSrc";

interface Props {
  src: string;
  alt: string;
  seed: string;
  w?: number;
  h?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export default function ArticleImage({ src, alt, seed, w = 600, h = 400, fill, sizes, priority, style }: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : w}
      height={fill ? undefined : h}
      sizes={sizes}
      priority={priority}
      unoptimized
      style={style}
      onError={() => {
        if (!imgSrc.includes("picsum.photos")) {
          setImgSrc(picsumFallback(seed, w, h));
        }
      }}
    />
  );
}
