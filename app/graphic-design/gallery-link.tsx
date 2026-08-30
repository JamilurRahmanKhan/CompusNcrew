"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useRef } from "react";

// The gallery's canvas paints these as WebGL textures on mount — warming
// the browser's HTTP cache for them on hover means TextureLoader resolves
// from cache instantly instead of waiting on the network.
const ARTWORK_IMAGES = [
  "/media/design-portfolio/coffee-campaign.png",
  "/media/design-portfolio/gaming-product.png",
  "/media/design-portfolio/shampoo-product.png",
  "/media/design-portfolio/lemonade-campaign.png",
];

/** Prefetches the target route's code and image assets on hover. */
export function GalleryLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const warmed = useRef(false);

  const warmUp = () => {
    if (warmed.current) return;
    warmed.current = true;

    router.prefetch(href);
    ARTWORK_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  };

  return (
    <Link href={href} className={className} onMouseEnter={warmUp} onTouchStart={warmUp}>
      {children}
    </Link>
  );
}
