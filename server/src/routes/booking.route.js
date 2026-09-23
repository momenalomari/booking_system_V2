import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getManagerBookings,
  getBookedSlots,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controller/booking.controller.js";
const BookingRouter = express.Router();

BookingRouter.post("/create_booking", createBooking);
BookingRouter.get("/all_bookings", getAllBookings);
BookingRouter.get("/my_bookings/:userId", getMyBookings);
BookingRouter.get("/manager_bookings/:managerId", getManagerBookings);
BookingRouter.get("/booked_slots/:fieldId", getBookedSlots);
BookingRouter.get("/booking/:id", getBookingById);
BookingRouter.put("/update_booking/:id", updateBooking);
BookingRouter.patch("/update_booking_status/:id", updateBookingStatus);
BookingRouter.delete("/delete_booking/:id", deleteBooking);

export default BookingRouter;
