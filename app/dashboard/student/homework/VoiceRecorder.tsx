"use client";

import { useRef, useState } from "react";

export function VoiceRecorder({
  onRecorded,
}: {
  onRecorded: (blob: Blob, filename: string) => void;
}) {
  const [state, setState] = useState<"idle" | "recording" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const filename = `voice-${Date.now()}.webm`;
        onRecorded(blob, filename);
        setState("done");
      };
      mr.start();
      mediaRef.current = mr;
      setSeconds(0);
      setState("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      alert("لا يمكن الوصول إلى الميكروفون");
    }
  };

  const stop = () => {
    mediaRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    setSeconds(0);
    onRecorded(new Blob(), "");
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-3">
      {state === "idle" && (
        <button
          type="button"
          onClick={start}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          ابدأ التسجيل الصوتي
        </button>
      )}

      {state === "recording" && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-900/20 border border-red-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-sm font-mono">{fmt(seconds)}</span>
          <button
            type="button"
            onClick={stop}
            className="mr-auto px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs hover:bg-red-500/30 transition"
          >
            إيقاف
          </button>
        </div>
      )}

      {state === "done" && audioUrl && (
        <div className="flex flex-col gap-2">
          <audio src={audioUrl} controls className="w-full h-9 rounded-lg" />
          <button
            type="button"
            onClick={reset}
            className="text-xs text-purple-300/50 hover:text-red-400 transition text-right"
          >
            × حذف التسجيل
          </button>
        </div>
      )}
    </div>
  );
}
