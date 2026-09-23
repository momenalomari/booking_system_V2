import Booking from "../model/Booking.Model.js";
import Field from "../model/Field.Model.js";
import { getDaySlots, isValidSlot, timesOverlap } from "../utils/slots.js";

const getBookingEndDate = (booking) =>
  new Date(`${booking.date}T${booking.endTime}:00`);

const markExpiredBookings = async () => {
  const activeBookings = await Booking.find({
    status: { $in: ["pending", "confirmed"] },
  }).select("date endTime");
  const expiredIds = activeBookings
    .filter((booking) => getBookingEndDate(booking) <= new Date())
    .map((booking) => booking._id);

  if (expiredIds.length > 0) {
    await Booking.updateMany(
      { _id: { $in: expiredIds }, status: { $in: ["pending", "confirmed"] } },
      { $set: { status: "expired" } },
    );
  }
};

const createBooking = async (req, res) => {
  try {
    await markExpiredBookings();
    const fieldId = req.body.fieldId || req.body.field;
    const userId = req.body.userId || req.body.user;
    const { date, startTime, endTime } = req.body;

    if (!fieldId || !userId || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "الرجاء تحديد الملعب والتاريخ ووقت البداية والنهاية",
      });
    }

    if (!isValidSlot(startTime, endTime)) {
      return res
        .status(400)
        .json({ message: "الحجز يجب أن يكون فترة ساعتين ضمن الفترات المتاحة" });
    }

    const requestedEnd = new Date(`${date}T${endTime}:00`);
    if (requestedEnd <= new Date()) {
      return res.status(400).json({
        message: "انتهى وقت هذه الفترة، اختر فترة ما زالت متاحة",
      });
    }

    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ message: "الملعب غير موجود" });
    }
    if (field.isAvailable === false) {
      return res
        .status(400)
        .json({ message: "هذا الملعب غير متاح للحجز حالياً" });
    }

    const existingBookings = await Booking.find({
      field: fieldId,
      date,
      status: { $in: ["pending", "confirmed"] },
    });

    const hasConflict = existingBookings.some((booking) =>
      timesOverlap(startTime, endTime, booking.startTime, booking.endTime),
    );

    if (hasConflict) {
      return res
        .status(409)
        .json({ message: "هذه الفترة محجوزة مسبقاً، اختر فترة أخرى" });
    }

    const booking = new Booking({
      user: userId,
      field: fieldId,
      date,
      startTime,
      endTime,
      status: "pending",
    });
    await booking.save();

    const populatedBooking = await booking.populate([
      { path: "user", select: "name email phone" },
      { path: "field", select: "name location type pricePerHour" },
    ]);

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    await markExpiredBookings();
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("field", "name location type pricePerHour")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب حجوزات مستخدم معين
const getMyBookings = async (req, res) => {
  try {
    await markExpiredBookings();
    const bookings = await Booking.find({
      user: req.params.userId,
      status: { $ne: "expired" },
    })
      .populate("field", "name location type pricePerHour image")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب حجوزات كل ملاعب صاحب الملعب (لوحة تحكم الـ owner)
const getManagerBookings = async (req, res) => {
  try {
    await markExpiredBookings();
    const { managerId } = req.params;
    const fields = await Field.find({ managerId }).select("_id");
    const fieldIds = fields.map((field) => field._id);

    const bookings = await Booking.find({ field: { $in: fieldIds } })
      .populate("user", "name email phone")
      .populate("field", "name location type pricePerHour")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب الفترات المحجوزة لملعب معين في تاريخ معين
const getBookedSlots = async (req, res) => {
  try {
    await markExpiredBookings();
    const { fieldId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "الرجاء تحديد التاريخ" });
    }

    const bookings = await Booking.find({
      field: fieldId,
      date,
      status: { $nin: ["cancelled", "expired"] },
    }).select("startTime endTime status");

    const bookedSlots = bookings.map((booking) => ({
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
    }));

    res.status(200).json({ date, allSlots: getDaySlots(), bookedSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("field", "name location");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.date = req.body.date || booking.date;
    booking.startTime = req.body.startTime || booking.startTime;
    booking.endTime = req.body.endTime || booking.endTime;
    booking.status = req.body.status || booking.status;
    const updatedBooking = await booking.save();
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// موافقة/رفض الحجز من قبل صاحب الملعب
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "حالة الحجز غير صحيحة" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "الحجز غير موجود" });
    }

    if (getBookingEndDate(booking) <= new Date()) {
      booking.status = "expired";
      await booking.save();
      return res.status(400).json({
        message: "انتهى وقت هذا الحجز ولا يمكن تغيير حالته",
      });
    }

    if (status === "confirmed") {
      const conflicting = await Booking.find({
        _id: { $ne: booking._id },
        field: booking.field,
        date: booking.date,
        status: "confirmed",
      });

      const hasConflict = conflicting.some((item) =>
        timesOverlap(
          booking.startTime,
          booking.endTime,
          item.startTime,
          item.endTime,
        ),
      );
      if (hasConflict) {
        return res
          .status(409)
          .json({ message: "يوجد حجز مؤكد آخر في نفس الفترة" });
      }
    }

    booking.status = status;
    await booking.save();

    const populatedBooking = await booking.populate([
      { path: "user", select: "name email phone" },
      { path: "field", select: "name location type pricePerHour" },
    ]);

    res.status(200).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "الحجز غير موجود" });
    }
    res.status(200).json({ message: "تم حذف الحجز بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createBooking,
  getAllBookings,
  getMyBookings,
  getManagerBookings,
  getBookedSlots,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  markExpiredBookings,
};
