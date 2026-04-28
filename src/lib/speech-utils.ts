/**
 * POLANITAS — Speech command utility (shared, client-safe)
 * No "use server" or "use client" directive — importable anywhere.
 */

export const QUESTION_INTENT_PATTERNS = [
  "apa yang ada", "ada apa", "bisa apa", "apa saja", "ada apa di sini",
  "jelaskan", "ceritakan", "beritahu", "informasi", "info",
  "ajarkan", "ajarin", "pelajari", "mulai belajar", "mulai mengajar",
  "apa isi", "isi nya", "ini halaman apa", "halaman ini berisi",
  "topik apa", "materi apa", "apa yang dipelajari",
];

/** Returns true if the normalized transcript looks like a question / explanation request */
export function isQuestion(text: string): boolean {
  return QUESTION_INTENT_PATTERNS.some((p) => text.includes(p));
}
