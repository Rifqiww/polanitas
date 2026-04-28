"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

export interface AccessibilityPrefs {
  isBlind: boolean;
  hasHandDisability: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  platforms: string[];
  accessibility: AccessibilityPrefs;
  profileCompleted: boolean;
}

const DEFAULT_PREFS: AccessibilityPrefs = {
  isBlind: false,
  hasHandDisability: false,
};

const LS_KEY = "polanitas_accessibility";

/** Reads prefs from localStorage (fast, synchronous). */
export function getLocalAccessibility(): AccessibilityPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AccessibilityPrefs) : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

/** Hook: loads prefs and exposes them reactively. */
export function useAccessibility(uid?: string | null) {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(getLocalAccessibility);

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.accessibility) {
          const serverPrefs = data.accessibility as AccessibilityPrefs;
          setPrefs(serverPrefs);
          localStorage.setItem(LS_KEY, JSON.stringify(serverPrefs));
        }
      }
    });
  }, [uid]);

  const savePrefs = useCallback(
    async (newPrefs: AccessibilityPrefs, newUid?: string) => {
      setPrefs(newPrefs);
      localStorage.setItem(LS_KEY, JSON.stringify(newPrefs));
      const targetUid = newUid ?? uid;
      if (targetUid) {
        await setDoc(
          doc(db, "users", targetUid),
          { accessibility: newPrefs },
          { merge: true }
        );
      }
    },
    [uid]
  );

  return { prefs, savePrefs };
}

/** Saves the full user profile to Firestore. */
export async function saveUserProfile(uid: string, profile: UserProfile) {
  await setDoc(doc(db, "users", uid), profile, { merge: true });
}

/** Checks if the user profile is already completed. */
export async function isProfileCompleted(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() && snap.data()?.profileCompleted === true;
}
