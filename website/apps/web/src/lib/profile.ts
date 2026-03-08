"use client";

const STORAGE_KEY = "cigar-profile";

export interface ProfilePreferences {
  strength?: string;
  body?: string;
}

export function getProfile(): ProfilePreferences {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    const o = parsed as Record<string, unknown>;
    return {
      strength: typeof o.strength === "string" ? o.strength : undefined,
      body: typeof o.body === "string" ? o.body : undefined,
    };
  } catch {
    return {};
  }
}

export function setProfile(prefs: ProfilePreferences): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new Event("cigar-profile-change"));
  } catch {
    // ignore
  }
}
