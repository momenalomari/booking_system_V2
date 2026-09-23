// منطق الفترات الزمنية الموحّد للحجوزات.
// كل حجز يمثل فترتين من الساعات (ساعتين) بالضبط.

// ساعات بداية الفترات خلال اليوم (كل فترة = ساعتان)
export const SLOT_START_HOURS = [8, 10, 12, 14, 16, 18, 20];

// مدة الحجز الواحد بالساعات
export const SLOT_DURATION_HOURS = 2;

const pad = (value) => String(value).padStart(2, "0");

// تحويل رقم الساعة إلى صيغة HH:00
export const hourToTime = (hour) => `${pad(hour)}:00`;

// توليد كل الفترات المتاحة في اليوم (كل فترة ساعتين)
export const getDaySlots = () =>
  SLOT_START_HOURS.map((start) => ({
    startTime: hourToTime(start),
    endTime: hourToTime(start + SLOT_DURATION_HOURS),
  }));

// هل هذا الوقت بداية/نهاية فترة صحيحة (ساعتان)
export const isValidSlot = (startTime, endTime) =>
  getDaySlots().some(
    (slot) => slot.startTime === startTime && slot.endTime === endTime,
  );

// هل الفترتان متقاطعتان زمنياً
export const timesOverlap = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && bStart < aEnd;
