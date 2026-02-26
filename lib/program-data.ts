export const PROGRAM_INFO = {
  name: "برنامج الوافي",
  number: 16,
  semester: "الفصل الدراسي الثاني",
  hijriYear: "1447هـ",
  approvalDate: "13/07/1447هـ",
};

export type Department = "arabic" | "islamic";

export interface Subject {
  name: string;
  icon: string;
}

export interface Level {
  id: string;
  name: string;
  shortName: string;
  department: Department;
  leader: string;
  subjects: Subject[];
}

export const LEVELS: Record<string, Level> = {
  level_2a: {
    id: "level_2a",
    name: "المستوى الثاني (أ)",
    shortName: "٢أ",
    department: "arabic",
    leader: "أ. أحمد عطية",
    subjects: [
      { name: "لغة عربية", icon: "📖" },
      { name: "ثقافة", icon: "🌍" },
      { name: "قرآن", icon: "📿" },
      { name: "محادثة", icon: "💬" },
      { name: "دليل الطالب", icon: "📚" },
      { name: "النشاط", icon: "⭐" },
    ],
  },
  level_2b: {
    id: "level_2b",
    name: "المستوى الثاني (ب)",
    shortName: "٢ب",
    department: "arabic",
    leader: "أ. محمد عبد المعبود",
    subjects: [
      { name: "لغة عربية", icon: "📖" },
      { name: "ثقافة", icon: "🌍" },
      { name: "قرآن", icon: "📿" },
      { name: "محادثة", icon: "💬" },
      { name: "دليل الطالب", icon: "📚" },
      { name: "النشاط", icon: "⭐" },
    ],
  },
  level_2c: {
    id: "level_2c",
    name: "المستوى الثاني (ج)",
    shortName: "٢ج",
    department: "arabic",
    leader: "أ. أحمد الليثي",
    subjects: [
      { name: "لغة عربية", icon: "📖" },
      { name: "ثقافة", icon: "🌍" },
      { name: "قرآن", icon: "📿" },
      { name: "محادثة", icon: "💬" },
      { name: "دليل الطالب", icon: "📚" },
      { name: "النشاط", icon: "⭐" },
    ],
  },
  level_2d: {
    id: "level_2d",
    name: "المستوى الثاني (د)",
    shortName: "٢د",
    department: "arabic",
    leader: "أ. علي خلف",
    subjects: [
      { name: "لغة عربية", icon: "📖" },
      { name: "ثقافة", icon: "🌍" },
      { name: "قرآن", icon: "📿" },
      { name: "محادثة", icon: "💬" },
      { name: "دليل الطالب", icon: "📚" },
      { name: "النشاط", icon: "⭐" },
    ],
  },
  level_4a: {
    id: "level_4a",
    name: "المستوى الرابع (أ)",
    shortName: "٤أ",
    department: "arabic",
    leader: "أ. أحمد نصري",
    subjects: [
      { name: "فهم المقروء", icon: "📖" },
      { name: "المفردات", icon: "🔤" },
      { name: "قراءة موسعة", icon: "📚" },
      { name: "القواعد", icon: "📐" },
      { name: "ثقافة", icon: "🌍" },
      { name: "فهم المسموع", icon: "👂" },
      { name: "المحادثة", icon: "💬" },
      { name: "تعبير", icon: "✍️" },
      { name: "قرآن", icon: "📿" },
      { name: "ألعاب لغوية", icon: "🎮" },
      { name: "النشاط", icon: "⭐" },
    ],
  },
  level_4b: {
    id: "level_4b",
    name: "المستوى الرابع (ب)",
    shortName: "٤ب",
    department: "arabic",
    leader: "أ. عصام صبري",
    subjects: [
      { name: "فهم المقروء", icon: "📖" },
      { name: "المفردات", icon: "🔤" },
      { name: "قراءة موسعة", icon: "📚" },
      { name: "القواعد", icon: "📐" },
      { name: "ثقافة", icon: "🌍" },
      { name: "فهم المسموع", icon: "👂" },
      { name: "المحادثة", icon: "💬" },
      { name: "تعبير", icon: "✍️" },
      { name: "قرآن", icon: "📿" },
      { name: "ألعاب لغوية", icon: "🎮" },
      { name: "النشاط", icon: "⭐" },
    ],
  },
  level_4c: {
    id: "level_4c",
    name: "المستوى الرابع (ج)",
    shortName: "٤ج",
    department: "arabic",
    leader: "أ. أمين محمد",
    subjects: [
      { name: "فهم المقروء", icon: "📖" },
      { name: "المفردات", icon: "🔤" },
      { name: "قراءة موسعة", icon: "📚" },
      { name: "القواعد", icon: "📐" },
      { name: "ثقافة", icon: "🌍" },
      { name: "فهم المسموع", icon: "👂" },
      { name: "المحادثة", icon: "💬" },
      { name: "تعبير", icon: "✍️" },
      { name: "قرآن", icon: "📿" },
      { name: "ألعاب لغوية", icon: "🎮" },
      { name: "النشاط", icon: "⭐" },
    ],
  },
  level_6a: {
    id: "level_6a",
    name: "المستوى السادس (أ)",
    shortName: "٦أ",
    department: "islamic",
    leader: "أ. مصطفى عبد ربه",
    subjects: [
      { name: "نحو", icon: "📐" },
      { name: "تفسير", icon: "📖" },
      { name: "العقيدة", icon: "🕌" },
      { name: "فقه", icon: "⚖️" },
      { name: "سيرة", icon: "📜" },
      { name: "قرآن", icon: "📿" },
      { name: "حديث", icon: "💬" },
      { name: "قراءة", icon: "📚" },
    ],
  },
  level_6b: {
    id: "level_6b",
    name: "المستوى السادس (ب)",
    shortName: "٦ب",
    department: "islamic",
    leader: "أ. طلال العوبثاني",
    subjects: [
      { name: "العقيدة", icon: "🕌" },
      { name: "نحو", icon: "📐" },
      { name: "فقه", icon: "⚖️" },
      { name: "تفسير", icon: "📖" },
      { name: "سيرة", icon: "📜" },
      { name: "حديث", icon: "💬" },
      { name: "قراءة", icon: "📚" },
      { name: "قرآن", icon: "📿" },
    ],
  },
  level_8: {
    id: "level_8",
    name: "المستوى الثامن",
    shortName: "٨",
    department: "islamic",
    leader: "",
    subjects: [
      { name: "فقه", icon: "⚖️" },
      { name: "عقيدة", icon: "🕌" },
      { name: "نحو", icon: "📐" },
      { name: "حديث", icon: "💬" },
      { name: "تاريخ", icon: "🏛️" },
      { name: "قراءة", icon: "📚" },
      { name: "تفسير", icon: "📖" },
      { name: "مذاهب", icon: "🗺️" },
      { name: "دعوة", icon: "📣" },
      { name: "قرآن", icon: "📿" },
    ],
  },
  level_10: {
    id: "level_10",
    name: "المستوى العاشر",
    shortName: "١٠",
    department: "islamic",
    leader: "",
    subjects: [
      { name: "عقيدة", icon: "🕌" },
      { name: "تفسير", icon: "📖" },
      { name: "فقه", icon: "⚖️" },
      { name: "مذاهب", icon: "🗺️" },
      { name: "حديث", icon: "💬" },
      { name: "نحو", icon: "📐" },
      { name: "قرآن", icon: "📿" },
      { name: "دعوة", icon: "📣" },
      { name: "قراءة", icon: "📚" },
      { name: "بحث", icon: "🔍" },
    ],
  },
};

export const ARABIC_LEVELS = Object.values(LEVELS).filter(
  (l) => l.department === "arabic"
);
export const ISLAMIC_LEVELS = Object.values(LEVELS).filter(
  (l) => l.department === "islamic"
);

export interface ScheduleSlot {
  time: string;
  label: string;
  isBreak?: boolean;
}

export const FRIDAY_SCHEDULE: ScheduleSlot[] = [
  { time: "١:٠٠ – ١:٤٥", label: "الحصة الأولى" },
  { time: "١:٤٥ – ٢:٣٠", label: "الحصة الثانية" },
  { time: "٢:٣٠ – ٣:١٥", label: "الحصة الثالثة" },
  { time: "٣:١٥ – ٤:٠٠", label: "صلاة العصر", isBreak: true },
  { time: "٤:٠٠ – ٤:٤٥", label: "الحصة الرابعة" },
  { time: "٤:٤٥ – ٥:٣٠", label: "الحصة الخامسة" },
];

export const SATURDAY_SCHEDULE: ScheduleSlot[] = [
  { time: "٨:٠٠ – ٨:٤٥", label: "الحصة الأولى" },
  { time: "٨:٤٥ – ٩:٣٠", label: "الحصة الثانية" },
  { time: "٩:٣٠ – ٩:٥٠", label: "فسحة", isBreak: true },
  { time: "٩:٥٠ – ١٠:٣٥", label: "الحصة الثالثة" },
  { time: "١٠:٣٥ – ١١:٢٠", label: "الحصة الرابعة" },
  { time: "١١:٢٠ – ١٢:٠٥", label: "الحصة الخامسة" },
  { time: "١٢:٠٥ – ١٢:٣٥", label: "صلاة الظهر", isBreak: true },
  { time: "١٢:٣٥ – ١:٢٠", label: "الحصة السادسة" },
  { time: "١:٢٠ – ٢:٠٥", label: "الحصة السابعة" },
];

export type CalendarEventType =
  | "study"
  | "exam_first"
  | "exam_second"
  | "final_exam"
  | "break"
  | "ceremony";

export interface CalendarEvent {
  gregorian: string; // YYYY-MM-DD
  hijri: string;
  dayAr: string;
  note: string;
  type: CalendarEventType;
}

export const ACADEMIC_CALENDAR: CalendarEvent[] = [
  { gregorian: "2025-12-26", hijri: "1447-07-06", dayAr: "الجمعة", note: "دراسة", type: "study" },
  { gregorian: "2025-12-27", hijri: "1447-07-07", dayAr: "السبت", note: "دراسة", type: "study" },
  { gregorian: "2026-01-02", hijri: "1447-07-13", dayAr: "الجمعة", note: "دراسة", type: "study" },
  { gregorian: "2026-01-03", hijri: "1447-07-14", dayAr: "السبت", note: "دراسة", type: "study" },
  { gregorian: "2026-01-09", hijri: "1447-07-20", dayAr: "الجمعة", note: "دراسة", type: "study" },
  { gregorian: "2026-01-10", hijri: "1447-07-21", dayAr: "السبت", note: "دراسة", type: "study" },
  { gregorian: "2026-01-16", hijri: "1447-07-27", dayAr: "الجمعة", note: "دراسة", type: "study" },
  { gregorian: "2026-01-17", hijri: "1447-07-28", dayAr: "السبت", note: "دراسة", type: "study" },
  { gregorian: "2026-01-23", hijri: "1447-08-04", dayAr: "الجمعة", note: "دراسة", type: "study" },
  { gregorian: "2026-01-24", hijri: "1447-08-05", dayAr: "السبت", note: "دراسة", type: "study" },
  { gregorian: "2026-01-30", hijri: "1447-08-11", dayAr: "الجمعة", note: "دراسة", type: "study" },
  { gregorian: "2026-01-31", hijri: "1447-08-12", dayAr: "السبت", note: "دراسة", type: "study" },
  { gregorian: "2026-02-06", hijri: "1447-08-18", dayAr: "الجمعة", note: "دراسة", type: "study" },
  { gregorian: "2026-02-07", hijri: "1447-08-19", dayAr: "السبت", note: "دراسة", type: "study" },
  { gregorian: "2026-02-13", hijri: "1447-08-25", dayAr: "الجمعة", note: "اختبار الشهر الأول", type: "exam_first" },
  { gregorian: "2026-02-14", hijri: "1447-08-26", dayAr: "السبت", note: "اختبار الشهر الأول (شرعي)", type: "exam_first" },
  { gregorian: "2026-02-20", hijri: "1447-09-03", dayAr: "الجمعة", note: "بداية إجازة رمضان والعيد (٦ أسابيع)", type: "break" },
  { gregorian: "2026-04-03", hijri: "1447-10-15", dayAr: "الجمعة", note: "اختبار الشهر الأول", type: "exam_first" },
  { gregorian: "2026-04-04", hijri: "1447-10-16", dayAr: "السبت", note: "اختبار الشهر الأول (لغوي + شرعي)", type: "exam_first" },
  { gregorian: "2026-05-01", hijri: "1447-11-14", dayAr: "الجمعة", note: "اختبار الشهر الثاني", type: "exam_second" },
  { gregorian: "2026-05-02", hijri: "1447-11-15", dayAr: "السبت", note: "اختبار الشهر الثاني (شرعي)", type: "exam_second" },
  { gregorian: "2026-05-08", hijri: "1447-11-21", dayAr: "الجمعة", note: "اختبار الشهر الثاني", type: "exam_second" },
  { gregorian: "2026-05-09", hijri: "1447-11-22", dayAr: "السبت", note: "اختبار الشهر الثاني (لغوي + شرعي)", type: "exam_second" },
  { gregorian: "2026-05-22", hijri: "1447-12-04", dayAr: "الجمعة", note: "بداية الاختبارات النهائية (مجموعة أ)", type: "final_exam" },
  { gregorian: "2026-05-23", hijri: "1447-12-05", dayAr: "السبت", note: "الاختبارات النهائية (مجموعة ب)", type: "final_exam" },
  { gregorian: "2026-06-05", hijri: "1447-12-19", dayAr: "الجمعة", note: "الاختبارات النهائية (مجموعة ج)", type: "final_exam" },
  { gregorian: "2026-06-06", hijri: "1447-12-20", dayAr: "السبت", note: "الاختبارات النهائية (مجموعة د)", type: "final_exam" },
  { gregorian: "2026-06-19", hijri: "1448-01-04", dayAr: "الجمعة", note: "الحفل الختامي", type: "ceremony" },
];

export const SPECIAL_ACTIVITIES = [
  "مسابقة الأندية",
  "عمرة الوافي",
  "المخيم الشرعي",
  "المخيم اللغوي",
  "إجازة عيد الأضحى",
];

export const EVENT_TYPE_STYLES: Record<
  CalendarEventType,
  { label: string; classes: string; dot: string }
> = {
  study: {
    label: "يوم دراسي",
    classes: "bg-purple-900/30 border-purple-700/40 text-purple-300",
    dot: "bg-purple-500",
  },
  exam_first: {
    label: "اختبار الشهر الأول",
    classes: "bg-amber-900/30 border-amber-600/40 text-amber-300",
    dot: "bg-amber-500",
  },
  exam_second: {
    label: "اختبار الشهر الثاني",
    classes: "bg-orange-900/30 border-orange-600/40 text-orange-300",
    dot: "bg-orange-500",
  },
  final_exam: {
    label: "اختبار نهائي",
    classes: "bg-red-900/30 border-red-600/40 text-red-300",
    dot: "bg-red-500",
  },
  break: {
    label: "إجازة",
    classes: "bg-green-900/30 border-green-600/40 text-green-300",
    dot: "bg-green-500",
  },
  ceremony: {
    label: "حفل",
    classes: "bg-pink-900/30 border-pink-600/40 text-pink-300",
    dot: "bg-pink-500",
  },
};
