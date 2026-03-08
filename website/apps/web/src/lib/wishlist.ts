"use client";

const STORAGE_KEY = "cigar-wishlist";

export interface WishlistItem {
  id: string;
  title: string;
  ctaHref?: string;
}

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isWishlistItem) : [];
  } catch {
    return [];
  }
}

function isWishlistItem(x: unknown): x is WishlistItem {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x &&
    typeof (x as WishlistItem).id === "string" &&
    "title" in x &&
    typeof (x as WishlistItem).title === "string"
  );
}

export function setWishlist(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cigar-wishlist-change"));
  } catch {
    // ignore
  }
}

export function addToWishlist(item: WishlistItem): boolean {
  const list = getWishlist();
  if (list.some((i) => i.id === item.id)) return false;
  setWishlist([...list, item]);
  return true;
}

export function removeFromWishlist(id: string): void {
  setWishlist(getWishlist().filter((i) => i.id !== id));
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some((i) => i.id === id);
}
