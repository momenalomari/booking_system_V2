import express from "express";
import dotenv from "dotenv";
import UserRouter from "./src/routes/user.Route.js";
import FieldRouter from "./src/routes/field.route.js";
import BookingRouter from "./src/routes/booking.route.js";
import AdminRouter from "./src/routes/admin.route.js";
import { markExpiredBookings } from "./src/controller/booking.controller.js";
import connectMongo from "./src/config/mongo.js";
import cors from "cors";
import path from "path";

dotenv.config();
connectMongo();
markExpiredBookings().catch((error) => {
  console.error("Failed to update expired bookings:", error.message);
});
setInterval(() => {
  markExpiredBookings().catch((error) => {
    console.error("Failed to update expired bookings:", error.message);
  });
}, 60 * 1000);
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://booking-system-v2-backend.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use("/api/users", UserRouter);
app.use("/api/fields", FieldRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/admin", AdminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
