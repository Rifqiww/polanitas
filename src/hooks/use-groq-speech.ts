"use client";

/**
 * POLANITAS — Groq Whisper Speech Hook (with Voice Activity Detection)
 *
 * Flow:
 *   1. Monitor mic audio level continuously via Web Audio API (AnalyserNode)
 *   2. Start recording ONLY when voice is detected (level > VOICE_THRESHOLD)
 *   3. Stop recording + send chunk to Groq ONLY after sustained silence
 *   4. Whisper transcribes → fires onTranscript
 *
 * This eliminates blank/noise chunks being sent to the API.
 */

import { useEffect, useRef, useState, useCallback } from "react";

export type RecordingStatus = "idle" | "listening" | "recording" | "processing" | "error";

interface UseGroqSpeechOptions {
  enabled: boolean;
  onTranscript: (text: string) => void;
  /** RMS threshold (0–255) to consider as voice. Default: 18 */
  voiceThreshold?: number;
  /** How long silence must last before we send the chunk (ms). Default: 900 */
  silenceDurationMs?: number;
  /** Maximum single utterance length (ms). Default: 8000 */
  maxRecordingMs?: number;
}

export function useGroqSpeech({
  enabled,
  onTranscript,
  voiceThreshold = 18,
  silenceDurationMs = 900,
  maxRecordingMs = 8000,
}: UseGroqSpeechOptions) {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Refs (avoid stale closure issues)
  const activeRef        = useRef(false);
  const streamRef        = useRef<MediaStream | null>(null);
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const analyserRef      = useRef<AnalyserNode | null>(null);
  const recorderRef      = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<Blob[]>([]);
  const silenceTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vadRafRef        = useRef<number | null>(null);
  const isRecordingRef   = useRef(false);
  const mimeTypeRef      = useRef("");
  const onTranscriptRef  = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  // ── Send chunk to /api/transcribe ─────────────────────────────────────────
  const sendChunk = useCallback(async (blob: Blob) => {
    if (!activeRef.current) return;
    if (blob.size < 2000) return; // too small = silence artifact

    setStatus("processing");
    try {
      const fd = new FormData();
      fd.append("audio", blob, "utterance.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      if (!res.ok) return;
      const data = await res.json();
      if (data.transcript?.trim()) {
        onTranscriptRef.current(data.transcript.trim());
      }
    } catch (err) {
      console.warn("[Groq Speech] transcribe failed:", err);
    } finally {
      if (activeRef.current) setStatus("listening");
    }
  }, []);

  // ── Stop current recording and send ──────────────────────────────────────
  const stopAndSend = useCallback(() => {
    if (!isRecordingRef.current) return;

    // Clear timers
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (maxTimerRef.current)     { clearTimeout(maxTimerRef.current);     maxTimerRef.current = null; }

    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current || "audio/webm" });
        chunksRef.current = [];
        isRecordingRef.current = false;
        await sendChunk(blob);
      };
      recorder.stop();
    } else {
      chunksRef.current = [];
      isRecordingRef.current = false;
    }
  }, [sendChunk]);

  // ── Start recording an utterance ──────────────────────────────────────────
  const startRecording = useCallback(() => {
    if (!activeRef.current || isRecordingRef.current || !streamRef.current) return;

    const mimeType = mimeTypeRef.current;
    const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : {});
    recorderRef.current = recorder;
    chunksRef.current = [];
    isRecordingRef.current = true;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.start(100); // collect data every 100ms
    setStatus("recording");

    // Safety max-length cap
    maxTimerRef.current = setTimeout(() => stopAndSend(), maxRecordingMs);
  }, [maxRecordingMs, stopAndSend]);

  // ── Voice Activity Detection loop (RAF) ───────────────────────────────────
  const runVAD = useCallback(() => {
    if (!activeRef.current || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function tick() {
      if (!activeRef.current) return;

      analyser.getByteTimeDomainData(dataArray);

      // Compute RMS (Root Mean Square) — measures volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const val = (dataArray[i] - 128) / 128; // normalize to [-1, 1]
        sum += val * val;
      }
      const rms = Math.sqrt(sum / bufferLength) * 255;

      const isSpeaking = rms > voiceThreshold;

      if (isSpeaking) {
        // Voice detected
        if (!isRecordingRef.current) {
          startRecording();
        }
        // Reset silence timer on each voice frame
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else {
        // Silence
        if (isRecordingRef.current && !silenceTimerRef.current) {
          // Start silence countdown — send after sustained silence
          silenceTimerRef.current = setTimeout(() => {
            silenceTimerRef.current = null;
            stopAndSend();
          }, silenceDurationMs);
        }
      }

      vadRafRef.current = requestAnimationFrame(tick);
    }

    vadRafRef.current = requestAnimationFrame(tick);
  }, [voiceThreshold, silenceDurationMs, startRecording, stopAndSend]);

  // ── Initialize mic + audio graph ──────────────────────────────────────────
  const init = useCallback(async () => {
    if (!activeRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      // Pick best MIME type
      mimeTypeRef.current = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"].find(
        (t) => MediaRecorder.isTypeSupported(t)
      ) ?? "";

      // Audio context for VAD
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;

      setStatus("listening");
      setErrorMsg(null);
      runVAD();
    } catch (err: any) {
      const msg = err?.name === "NotAllowedError"
        ? "Izin mikrofon ditolak. Izinkan di pengaturan browser."
        : "Tidak bisa mengakses mikrofon.";
      setErrorMsg(msg);
      setStatus("error");
    }
  }, [runVAD]);

  // ── Teardown everything ───────────────────────────────────────────────────
  const teardown = useCallback(() => {
    activeRef.current = false;

    if (vadRafRef.current)      { cancelAnimationFrame(vadRafRef.current); vadRafRef.current = null; }
    if (silenceTimerRef.current){ clearTimeout(silenceTimerRef.current);   silenceTimerRef.current = null; }
    if (maxTimerRef.current)    { clearTimeout(maxTimerRef.current);        maxTimerRef.current = null; }

    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    isRecordingRef.current = false;
    chunksRef.current = [];

    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    setStatus("idle");
  }, []);

  // ── React to enabled changes ──────────────────────────────────────────────
  useEffect(() => {
    if (enabled) {
      activeRef.current = true;
      init();
    } else {
      teardown();
    }
    return () => {
      activeRef.current = false;
      teardown();
    };
  }, [enabled]); // eslint-disable-line

  return { status, errorMsg };
}
