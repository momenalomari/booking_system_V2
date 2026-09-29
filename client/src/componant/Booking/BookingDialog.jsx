import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getDaySlots,
  timesOverlap,
  formatSlot,
  todayISO,
} from "../utils/slots";

export default function BookingDialog({ field, onClose, onBooked }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [date, setDate] = useState(todayISO());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);

  const allSlots = getDaySlots();

  useEffect(() => {
    if (!field?._id || !date) return;
    let active = true;
    setLoadingSlots(true);
    setSelectedSlot(null);
    axios
      .get(
        `https://booking-system-v2-backend.onrender.com/api/bookings/booked_slots/${field._id}?date=${date}`,
      )
      .then((res) => {
        if (active) setBookedSlots(res.data.bookedSlots || []);
      })
      .catch(() => {
        if (active) setBookedSlots([]);
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });
    return () => {
      active = false;
    };
  }, [field?._id, date]);

  const isSlotBooked = (slot) =>
    bookedSlots.some((booked) =>
      timesOverlap(
        slot.startTime,
        slot.endTime,
        booked.startTime,
        booked.endTime,
      ),
    );

  const isSlotExpired = (slot) =>
    new Date(`${date}T${slot.endTime}:00`) <= new Date();

  const submitBooking = async () => {
    if (!user?._id && !user?.id) {
      toast.error("سجل الدخول أولاً حتى تتمكن من الحجز");
      return;
    }
    if (!date || !selectedSlot) {
      toast.error("حدد التاريخ والفترة (ساعتين)");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        "https://booking-system-v2-backend.onrender.com/api/bookings/create_booking",
        {
          fieldId: field._id,
          userId: user._id || user.id,
          date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
      );
      toast.success("تم إرسال طلب الحجز، بانتظار موافقة صاحب الملعب");
      setSelectedSlot(null);
      onBooked?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر إرسال طلب الحجز");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={Boolean(field)}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>حجز {field?.name}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          اختر التاريخ وفترة ساعتين، وسيصل الطلب لصاحب الملعب للموافقة.
        </Typography>
        <TextField
          fullWidth
          type="date"
          label="تاريخ الحجز"
          InputLabelProps={{ shrink: true }}
          margin="dense"
          value={date}
          inputProps={{ min: todayISO() }}
          onChange={(e) => setDate(e.target.value)}
        />

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          الفترات المتاحة (كل فترة ساعتان)
        </Typography>

        {loadingSlots ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={26} color="success" />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {allSlots.map((slot) => {
              const booked = isSlotExpired(slot) || isSlotBooked(slot);
              const selected =
                selectedSlot?.startTime === slot.startTime &&
                selectedSlot?.endTime === slot.endTime;
              return (
                <Chip
                  key={slot.startTime}
                  label={formatSlot(slot.startTime, slot.endTime)}
                  color={booked ? "default" : selected ? "success" : "primary"}
                  variant={
                    booked ? "outlined" : selected ? "filled" : "outlined"
                  }
                  disabled={booked}
                  onClick={() => setSelectedSlot(slot)}
                  sx={{ cursor: booked ? "not-allowed" : "pointer" }}
                />
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          إلغاء
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={submitBooking}
          disabled={saving || !selectedSlot}
        >
          {saving ? "جاري الإرسال..." : "إرسال طلب الحجز"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
