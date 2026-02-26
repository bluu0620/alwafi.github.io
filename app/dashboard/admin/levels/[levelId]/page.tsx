import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { LEVELS } from "@/lib/program-data";
import { getLevelsConfig, mergeLevel } from "@/lib/level-config";
import { LevelEditorClient } from "./LevelEditorClient";

export default async function LevelEditorPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const user = await currentUser();
  if (!user || user.unsafeMetadata?.role !== "admin") redirect("/");

  const { levelId } = await params;
  if (!LEVELS[levelId]) notFound();

  const config = await getLevelsConfig();
  const level = mergeLevel(levelId, config);
  const isCustomized = !!config[levelId];

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard/admin"
            className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700/30 flex items-center justify-center text-purple-300 hover:bg-purple-900/60 transition"
          >
            →
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              تعديل المستوى
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-purple-300/60 text-sm">{LEVELS[levelId].name}</p>
              {isCustomized && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  معدّل
                </span>
              )}
            </div>
          </div>
        </div>

        <LevelEditorClient
          levelId={levelId}
          defaultName={level.name}
          defaultShortName={level.shortName}
          defaultLeader={level.leader}
          defaultSubjects={level.subjects}
          isCustomized={isCustomized}
        />

      </div>
    </div>
  );
}
