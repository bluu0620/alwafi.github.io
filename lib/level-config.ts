import { put, list } from "@vercel/blob";
import { LEVELS, type Level, type Subject } from "./program-data";

export interface LevelOverride {
  name?: string;
  shortName?: string;
  leader?: string;
  subjects?: Subject[];
}

export type LevelsConfig = Record<string, LevelOverride>;

const BLOB_PATH = "admin/levels-config.json";

export async function getLevelsConfig(): Promise<LevelsConfig> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    const blob = blobs.find((b) => b.pathname === BLOB_PATH);
    if (!blob) return {};
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export function mergeLevel(levelId: string, config: LevelsConfig): Level {
  const base = LEVELS[levelId];
  if (!base) throw new Error(`Unknown level: ${levelId}`);
  const override = config[levelId];
  if (!override) return base;
  return {
    ...base,
    ...(override.name ? { name: override.name } : {}),
    ...(override.shortName ? { shortName: override.shortName } : {}),
    ...(override.leader !== undefined ? { leader: override.leader } : {}),
    ...(override.subjects ? { subjects: override.subjects } : {}),
  };
}

export function getAllMergedLevels(config: LevelsConfig): Record<string, Level> {
  const result: Record<string, Level> = {};
  for (const [id] of Object.entries(LEVELS)) {
    result[id] = mergeLevel(id, config);
  }
  return result;
}

export async function saveLevelsConfig(config: LevelsConfig): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(config), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}
