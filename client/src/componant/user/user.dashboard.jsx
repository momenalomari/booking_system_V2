import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `https://booking-system-v2-backend.onrender.com/api/bookings/my_bookings/${userId}`,
        );
        if (!active) return;

        const nextBookings = response.data || [];
        nextBookings.forEach((booking) => {
          const storageKey = `booking-status-${booking._id}`;
          const previousStatus = localStorage.getItem(storageKey);
          if (
            previousStatus !== booking.status &&
            ["confirmed", "cancelled"].includes(booking.status)
          ) {
            toast[booking.status === "confirmed" ? "success" : "error"](
              booking.status === "confirmed"
                ? "تمت الموافقة على حجزك"
                : "تم رفض حجزك",
            );
          }
          localStorage.setItem(storageKey, booking.status);
        });
        setBookings(nextBookings);
      } catch (error) {
        if (active) {
          toast.error(error.response?.data?.message || "تعذر جلب حجوزاتك");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBookings();
    const refreshId = window.setInterval(fetchBookings, 15000);
    return () => {
      active = false;
      window.clearInterval(refreshId);
    };
  }, [userId]);

  const statusLabels = {
    pending: "بانتظار الموافقة",
    confirmed: "مؤكد",
    cancelled: "مرفوض",
    expired: "منتهي",
  };

  const statusColors = {
    pending: "warning",
    confirmed: "success",
    cancelled: "error",
    expired: "default",
  };

  return (
    <Container maxWidth="md" sx={{ py: 7 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        أهلاً {user?.name || "بك"} 👋
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        من هنا يمكنك الوصول إلى الملاعب ومتابعة حجوزاتك بسهولة.
      </Typography>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            حجوزاتي
          </Typography>
          {loading ? (
            <CircularProgress color="success" size={28} />
          ) : bookings.length > 0 ? (
            <Stack spacing={2}>
              {bookings.map((booking, index) => (
                <React.Fragment key={booking._id}>
                  {index > 0 && <Divider />}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                  >
                    <div>
                      <Typography sx={{ fontWeight: "bold" }}>
                        {booking.field?.name || "ملعب"}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {booking.date} | {booking.startTime} - {booking.endTime}
                      </Typography>
                    </div>
                    <Chip
                      label={statusLabels[booking.status] || booking.status}
                      color={statusColors[booking.status] || "default"}
                    />
                  </Stack>
                </React.Fragment>
              ))}
            </Stack>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              لا توجد حجوزات حتى الآن. اختر ملعباً مناسباً وابدأ بحجز وقت اللعب.
            </Alert>
          )}
          <Button
            component={Link}
            to="/fields"
            variant="contained"
            color="success"
          >
            استعرض الملاعب
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
