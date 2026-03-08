"use client";

import { WishlistProvider } from "../contexts/WishlistContext";
import { AppNav } from "./AppNav";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <AppNav />
      {children}
    </WishlistProvider>
  );
}
