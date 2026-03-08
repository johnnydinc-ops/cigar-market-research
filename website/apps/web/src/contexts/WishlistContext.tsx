"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { WishlistItem } from "../lib/wishlist.js";
import {
  addToWishlist as addStorage,
  getWishlist,
  removeFromWishlist as removeStorage,
} from "../lib/wishlist";

type WishlistContextValue = {
  items: WishlistItem[];
  add: (item: WishlistItem) => boolean;
  remove: (id: string) => void;
  has: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const sync = useCallback(() => setItems(getWishlist()), []);

  useEffect(() => {
    sync();
    const handler = () => sync();
    window.addEventListener("cigar-wishlist-change", handler);
    return () => window.removeEventListener("cigar-wishlist-change", handler);
  }, [sync]);

  const add = useCallback(
    (item: WishlistItem) => {
      const ok = addStorage(item);
      if (ok) sync();
      return ok;
    },
    [sync]
  );

  const remove = useCallback(
    (id: string) => {
      removeStorage(id);
      sync();
    },
    [sync]
  );

  const has = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, add, remove, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
