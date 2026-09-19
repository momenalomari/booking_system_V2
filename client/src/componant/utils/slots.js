// فترات الحجز الموحّدة: كل حجز = ساعتان
export const SLOT_START_HOURS = [8, 10, 12, 14, 16, 18, 20];
export const SLOT_DURATION_HOURS = 2;

const pad = (value) => String(value).padStart(2, "0");

export const hourToTime = (hour) => `${pad(hour)}:00`;

// توليد كل فترات اليوم (كل فترة ساعتين)
export const getDaySlots = () =>
  SLOT_START_HOURS.map((start) => ({
    startTime: hourToTime(start),
    endTime: hourToTime(start + SLOT_DURATION_HOURS),
  }));

// هل الفترتان متقاطعتان
export const timesOverlap = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && bStart < aEnd;

// تنسيق عرض الفترة
export const formatSlot = (startTime, endTime) => `${startTime} - ${endTime}`;

// تاريخ اليوم بصيغة YYYY-MM-DD
export const todayISO = () => new Date().toISOString().split("T")[0];
