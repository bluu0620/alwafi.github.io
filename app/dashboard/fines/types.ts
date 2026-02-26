export type Fine = {
  id: string;
  reason: "phone" | "language" | "other";
  otherNote?: string;
  issuedByName: string;
  issuedById: string;
  issuedAt: string;
  paid?: boolean;
};

export const FINE_REASONS: Record<string, string> = {
  phone: "استخدام الجوال ",
  language: "التحدث بغير العربية",
  other: "أخرى",
};
