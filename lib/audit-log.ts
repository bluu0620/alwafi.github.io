import { clerkClient } from "@clerk/nextjs/server";

export type AuditEntry = {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  performedById: string;
  timestamp: string;
};

const MAX_PER_USER = 50;

export async function logAuditEvent(
  performerId: string,
  performerName: string,
  action: string,
  details: string
) {
  const client = await clerkClient();
  const performer = await client.users.getUser(performerId);
  const existing = (performer.unsafeMetadata?.actionLog as AuditEntry[] | undefined) ?? [];

  const entry: AuditEntry = {
    id: crypto.randomUUID(),
    action,
    details,
    performedBy: performerName,
    performedById: performerId,
    timestamp: new Date().toISOString(),
  };

  await client.users.updateUser(performerId, {
    unsafeMetadata: {
      ...performer.unsafeMetadata,
      actionLog: [entry, ...existing].slice(0, MAX_PER_USER),
    },
  });
}
