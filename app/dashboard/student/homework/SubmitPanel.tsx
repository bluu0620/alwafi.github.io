"use client";

import { useRef, useState, useTransition } from "react";
import { VoiceRecorder } from "./VoiceRecorder";
import { submitHomework, deleteSubmission } from "@/app/dashboard/homework/actions";
import { type Submission } from "@/lib/homework-types";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function SubmissionRow({ sub, subject }: { sub: Submission; subject: string }) {
  const [pending, startTransition] = useTransition();
  const icon = sub.type === "audio" ? "🎙️" : sub.type === "image" ? "🖼️" : "📄";

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-900/30 border border-purple-800/30">
      <span className="text-xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <a
          href={sub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white hover:text-amber-400 transition truncate block"
        >
          {sub.filename}
        </a>
        <p className="text-xs text-purple-300/50">
          {formatBytes(sub.size)} · {formatDate(sub.submittedAt)}
        </p>
      </div>
      <button
        onClick={() =>
          startTransition(async () => {
            await deleteSubmission(subject, sub.id);
          })
        }
        disabled={pending}
        className="shrink-0 text-xs text-red-500/60 hover:text-red-400 transition disabled:opacity-40"
      >
        حذف
      </button>
    </div>
  );
}

export function SubmitPanel({
  subject,
  existingSubmissions,
}: {
  subject: string;
  existingSubmissions: Submission[];
}) {
  const [tab, setTab] = useState<"file" | "image" | "audio">("file");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<{ blob: Blob; filename: string } | null>(null);

  const handleSubmit = () => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("subject", subject);

        if (tab === "audio") {
          if (!audioRef.current?.blob.size) {
            setError("لم يتم تسجيل صوت");
            return;
          }
          const audioFile = new File(
            [audioRef.current.blob],
            audioRef.current.filename,
            { type: "audio/webm" }
          );
          fd.append("file", audioFile);
        } else {
          const file = fileRef.current?.files?.[0];
          if (!file) {
            setError("لم تختر ملفاً");
            return;
          }
          fd.append("file", file);
        }

        await submitHomework(fd);
        setSuccess(true);
        if (fileRef.current) fileRef.current.value = "";
        audioRef.current = null;
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  return (
    <div className="mt-4">
      {/* Previous submissions */}
      {existingSubmissions.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-purple-300/50 uppercase tracking-wider mb-2">
            الواجبات المرسلة ({existingSubmissions.length})
          </p>
          <div className="space-y-2">
            {existingSubmissions.map((s) => (
              <SubmissionRow key={s.id} sub={s} subject={subject} />
            ))}
          </div>
        </div>
      )}

      {/* Upload form */}
      <div className="bg-purple-900/20 rounded-2xl border border-amber-500/10 p-4">
        <p className="text-sm font-bold text-amber-400 mb-3">إرسال واجب جديد</p>

        {/* Tab picker */}
        <div className="flex gap-2 mb-4">
          {([
            { key: "file", label: "ملف", icon: "📄" },
            { key: "image", label: "صورة", icon: "🖼️" },
            { key: "audio", label: "صوتي", icon: "🎙️" },
          ] as const).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition ${
                tab === t.key
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                  : "bg-purple-900/40 border-purple-700/30 text-purple-300/60 hover:text-purple-300"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "file" && (
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
            className="w-full text-sm text-purple-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 file:transition"
          />
        )}

        {tab === "image" && (
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="w-full text-sm text-purple-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 file:transition"
          />
        )}

        {tab === "audio" && (
          <VoiceRecorder
            onRecorded={(blob, filename) => {
              audioRef.current = { blob, filename };
            }}
          />
        )}

        {error && (
          <p className="mt-3 text-xs text-red-400">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-xs text-green-400">تم الإرسال بنجاح ✓</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 text-[#0f0f1a] font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {pending ? "جاري الإرسال..." : "إرسال الواجب"}
        </button>
      </div>
    </div>
  );
}
