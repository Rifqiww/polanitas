/**
 * POLANITAS — Groq Whisper Speech-to-Text API Route
 * POST /api/transcribe
 *
 * Accepts: multipart/form-data with field "audio" (Blob/File)
 * Returns: { transcript: string } | { error: string }
 *
 * Uses GROQ_API_KEY_GENERAL + whisper-large-v3-turbo model.
 * Only accessible by authenticated users (reads __session cookie).
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGeneralClient } from "@/lib/groq-client";
import { toFile } from "groq-sdk";

async function getUid(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("__session")?.value ?? null;
}

export async function POST(req: NextRequest) {
  // Auth check
  const uid = await getUid();
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const audioBlob = formData.get("audio") as Blob | null;

    if (!audioBlob || audioBlob.size === 0) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    // Convert Blob → File-like object that Groq SDK accepts
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioFile = await toFile(
      Buffer.from(arrayBuffer),
      "audio.webm",
      { type: audioBlob.type || "audio/webm" }
    );

    const groq = getGeneralClient();

    const result = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      language: "id",           // Indonesian
      response_format: "json",
      temperature: 0,
    });

    return NextResponse.json({ transcript: result.text ?? "" });
  } catch (err: any) {
    console.error("[Groq Whisper] Error:", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Transcription failed" },
      { status: 500 }
    );
  }
}

// Max audio size: 25 MB (Groq Whisper limit)
export const config = {
  api: {
    bodyParser: false,
  },
};
