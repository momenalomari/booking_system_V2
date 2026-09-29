import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import axios from "axios";
import { toast } from "react-toastify";
import { getDaySlots, formatSlot, todayISO } from "../utils/slots";

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

export default function OwnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const managerId = user?._id || user?.id;

  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [slotsFieldId, setSlotsFieldId] = useState("");
  const [slotsDate, setSlotsDate] = useState(todayISO());
  const [busyId, setBusyId] = useState(null);
  const [showAddField, setShowAddField] = useState(false);
  const [addingField, setAddingField] = useState(false);
  const [newField, setNewField] = useState({
    name: "",
    location: "",
    type: "football",
    pricePerHour: "",
    description: "",
    image: "",
  });

  const fetchData = async () => {
    if (!managerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [fieldsRes, bookingsRes] = await Promise.all([
        axios.get(
          `https://booking-system-v2-backend.onrender.com/api/fields/manager_fields/${managerId}`,
        ),
        axios.get(
          `https://booking-system-v2-backend.onrender.com/api/bookings/manager_bookings/${managerId}`,
        ),
      ]);
      setFields(fieldsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر جلب بيانات الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managerId]);

  useEffect(() => {
    if (!slotsFieldId && fields.length > 0) {
      setSlotsFieldId(fields[0]._id);
    }
  }, [fields, slotsFieldId]);

  const filteredBookings = useMemo(() => {
    const list =
      statusFilter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === statusFilter);
    return [...list].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return a.startTime < b.startTime ? -1 : 1;
    });
  }, [bookings, statusFilter]);

  const stats = useMemo(
    () => ({
      fields: fields.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
    }),
    [fields, bookings],
  );

  const slotInfo = useMemo(() => {
    const allSlots = getDaySlots();
    const dayBookings = bookings.filter(
      (booking) =>
        (booking.field?._id || booking.field) === slotsFieldId &&
        booking.date === slotsDate &&
        booking.status !== "cancelled",
    );
    return allSlots.map((slot) => {
      const match = dayBookings.find(
        (booking) =>
          slot.startTime < booking.endTime && booking.startTime < slot.endTime,
      );
      return { ...slot, booking: match || null };
    });
  }, [bookings, slotsFieldId, slotsDate]);

  const updateStatus = async (bookingId, status) => {
    setBusyId(bookingId);
    try {
      const res = await axios.patch(
        `https://booking-system-v2-backend.onrender.com/api/bookings/update_booking_status/${bookingId}`,
        { status },
      );
      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? res.data : booking,
        ),
      );
      toast.success(status === "confirmed" ? "تم تأكيد الحجز" : "تم رفض الحجز");
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث حالة الحجز");
    } finally {
      setBusyId(null);
    }
  };

  const handleAddField = async () => {
    if (
      !newField.name.trim() ||
      !newField.location.trim() ||
      !newField.pricePerHour
    ) {
      toast.error("اسم الملعب والموقع والسعر حقول مطلوبة");
      return;
    }
    setAddingField(true);
    try {
<<<<<<< HEAD
      await axios.post(
        "https://booking-system-v2-backend.onrender.com/api/fields/create_field",
        {
          managerId,
          name: newField.name.trim(),
          location: newField.location.trim(),
          type: newField.type,
          pricePerHour: Number(newField.pricePerHour),
          description: newField.description,
          image: newField.image,
        },
      );
=======
      await axios.post("https://booking-system-v2-backend.onrender.com/api/fields/create_field", {
        managerId,
        name: newField.name.trim(),
        location: newField.location.trim(),
        type: newField.type,
        pricePerHour: Number(newField.pricePerHour),
        description: newField.description,
        image: newField.image,
      });
>>>>>>> 411ed307cb8edb27410871df62577cd1409d0e8a
      toast.success("تمت إضافة الملعب بنجاح");
      setNewField({
        name: "",
        location: "",
        type: "football",
        pricePerHour: "",
        description: "",
        image: "",
      });
      setShowAddField(false);
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر إضافة الملعب");
    } finally {
      setAddingField(false);
    }
  };

  if (!managerId) {
    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Alert severity="warning">
          لم يتم العثور على حساب صاحب الملعب، الرجاء تسجيل الدخول مرة أخرى.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          لوحة تحكم صاحب الملعب
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          أهلاً {user?.name || ""}، تابع طلبات الحجز ووافق عليها، وشاهد الفترات
          المتاحة لكل ملعب.
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            {
              label: "عدد الملاعب",
              value: stats.fields,
              icon: <SportsSoccerOutlinedIcon />,
              color: "#2563eb",
            },
            {
              label: "طلبات بانتظار الموافقة",
              value: stats.pending,
              icon: <PendingActionsIcon />,
              color: "#d97706",
            },
            {
              label: "حجوزات مؤكدة",
              value: stats.confirmed,
              icon: <EventAvailableIcon />,
              color: "#16a34a",
            },
          ].map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card
                elevation={0}
                sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      color: stat.color,
                      background: `${stat.color}15`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {loading ? "—" : stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: showAddField ? 3 : 0,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ملاعبي
              </Typography>
              <Typography variant="body2" color="text.secondary">
                أضف ملعباً جديداً ليظهر للاعبين مع اسمك كصاحب للملعب.
              </Typography>
            </Box>
            <Button
              variant={showAddField ? "outlined" : "contained"}
              color="success"
              onClick={() => setShowAddField((prev) => !prev)}
            >
              {showAddField ? "إغلاق النموذج" : "إضافة ملعب جديد"}
            </Button>
          </Box>

          {showAddField && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="اسم الملعب"
                    value={newField.name}
                    onChange={(e) =>
                      setNewField({ ...newField, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="الموقع"
                    value={newField.location}
                    onChange={(e) =>
                      setNewField({ ...newField, location: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="النوع"
                    value={newField.type}
                    onChange={(e) =>
                      setNewField({ ...newField, type: e.target.value })
                    }
                  >
                    <MenuItem value="football">كرة قدم</MenuItem>
                    <MenuItem value="basketball">كرة سلة</MenuItem>
                    <MenuItem value="padel">بادل</MenuItem>
                    <MenuItem value="tennis">تنس</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="السعر بالساعة (دينار)"
                    value={newField.pricePerHour}
                    onChange={(e) =>
                      setNewField({ ...newField, pricePerHour: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="رابط صورة الملعب"
                    value={newField.image}
                    onChange={(e) =>
                      setNewField({ ...newField, image: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="وصف الملعب"
                    value={newField.description}
                    onChange={(e) =>
                      setNewField({ ...newField, description: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={addingField}
                  onClick={handleAddField}
                >
                  {addingField ? "جاري الإضافة..." : "حفظ الملعب"}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              طلبات الحجز من المستخدمين
            </Typography>
            <TextField
              select
              size="small"
              label="حالة الحجز"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              sx={{ minWidth: 190 }}
            >
              <MenuItem value="all">كل الحالات</MenuItem>
              <MenuItem value="pending">بانتظار الموافقة</MenuItem>
              <MenuItem value="confirmed">مؤكد</MenuItem>
              <MenuItem value="cancelled">مرفوض</MenuItem>
            </TextField>
          </Box>

          {loading ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <CircularProgress color="success" />
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Alert severity="info">لا توجد طلبات حجز مطابقة حالياً.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>المستخدم</TableCell>
                    <TableCell>الهاتف</TableCell>
                    <TableCell>الملعب</TableCell>
                    <TableCell>التاريخ</TableCell>
                    <TableCell>الفترة (ساعتان)</TableCell>
                    <TableCell>الحالة</TableCell>
                    <TableCell align="center">الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking, index) => (
                    <TableRow hover key={booking._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {booking.user?.name || "غير معروف"}
                      </TableCell>
                      <TableCell>{booking.user?.phone || "-"}</TableCell>
                      <TableCell>{booking.field?.name || "-"}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={formatSlot(booking.startTime, booking.endTime)}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={statusLabels[booking.status] || booking.status}
                          color={statusColors[booking.status] || "default"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          disabled={
                            busyId === booking._id ||
                            booking.status === "confirmed"
                          }
                          onClick={() => updateStatus(booking._id, "confirmed")}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<CancelIcon />}
                          disabled={
                            busyId === booking._id ||
                            booking.status === "cancelled"
                          }
                          onClick={() => updateStatus(booking._id, "cancelled")}
                        >
                          رفض
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            الفترات المتاحة لكل ملعب
          </Typography>

          {fields.length === 0 ? (
            <Alert severity="info">لا توجد ملاعب مسجلة على حسابك بعد.</Alert>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                <TextField
                  select
                  size="small"
                  label="الملعب"
                  value={slotsFieldId}
                  onChange={(event) => setSlotsFieldId(event.target.value)}
                  sx={{ minWidth: 220 }}
                >
                  {fields.map((field) => (
                    <MenuItem key={field._id} value={field._id}>
                      {field.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  type="date"
                  label="التاريخ"
                  InputLabelProps={{ shrink: true }}
                  value={slotsDate}
                  onChange={(event) => setSlotsDate(event.target.value)}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {slotInfo.map((slot) => {
                  const booked = Boolean(slot.booking);
                  const confirmed = slot.booking?.status === "confirmed";
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={slot.startTime}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          border: "1px solid",
                          borderColor: booked
                            ? confirmed
                              ? "#16a34a"
                              : "#d97706"
                            : "#e5e7eb",
                          borderRadius: 2,
                          background: booked ? "#fff" : "#f0fdf4",
                        }}
                      >
                        <CardContent>
                          <Typography sx={{ fontWeight: 700, mb: 1 }}>
                            {formatSlot(slot.startTime, slot.endTime)}
                          </Typography>
                          {booked ? (
                            <>
                              <Chip
                                size="small"
                                label={statusLabels[slot.booking.status]}
                                color={statusColors[slot.booking.status]}
                                sx={{ mb: 1 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {slot.booking.user?.name || "مستخدم"} —{" "}
                                {slot.booking.user?.phone || ""}
                              </Typography>
                            </>
                          ) : (
                            <Chip
                              size="small"
                              label="متاح للحجز"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
