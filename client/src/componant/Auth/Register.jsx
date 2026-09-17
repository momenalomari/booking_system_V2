import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  // 1. تجهيز الـ States لتخزين مدخلات المستخدم
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    role: "user",
    ownershipProof: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // أداة للتنقل بين الصفحات برمجياً

  // دالة لتحديث البيانات جوا الـ State عند الكتابة
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProofChange = (e) => {
    setFormData({
      ...formData,
      ownershipProof: e.target.files?.[0] || null,
    });
  };

  // 2. دالة إرسال البيانات للباك إند
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع الصفحة من إعادة التحميل الافتراضية

    // 🚨 التعديل الأول: الفحص بيصير قبل الـ Loading وقبل إرسال أي شيء للسيرفر
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.phone === "" ||
      formData.password === "" ||
      formData.confirm_password === ""
    ) {
      toast.error("الرجاء ملء جميع الحقول");
      return; // return معناها: وقف الكود هون ولا تكمل لتحت
    }

    if (formData.password !== formData.confirm_password) {
      toast.error("كلمة المرور وتأكيدها غير متطابقين!");
      return;
    }

    if (!/^\+?[0-9\s()-]{7,20}$/.test(formData.phone.trim())) {
      toast.error("أدخل رقم هاتف صحيح");
      return;
    }

    if (formData.role === "owner") {
      if (!formData.ownershipProof) {
        toast.error("لا يمكن إنشاء حساب صاحب ملعب بدون مستند يثبت ملكية أو استثمار الملعب");
        return;
      }

      const allowedProofTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];
      if (
        !allowedProofTypes.includes(formData.ownershipProof.type) ||
        formData.ownershipProof.size > 10 * 1024 * 1024
      ) {
        toast.error("أرفق سند ملكية أو عقد استثمار بصيغة PDF أو JPG أو PNG وبحجم أقصى 10MB");
        return;
      }
    }

    // إذا وصلنا لهون، معناها البيانات ممتازة واليوزر مش ناسي إشي
    setLoading(true);

    try {
      let requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
        role: formData.role,
      };

      if (formData.role === "owner") {
        const ownerRequestData = new FormData();
        Object.entries(requestData).forEach(([key, value]) => {
          ownerRequestData.append(key, value);
        });
        ownerRequestData.append("ownershipProof", formData.ownershipProof);
        requestData = ownerRequestData;
      }

      // إرسال طلب POST للباك إند ومعه بيانات المستخدم
      // غيرنا الكلمة الأخيرة من register إلى create_user
      const response = await axios.post(
        "http://localhost:5000/api/users/create_user",
        requestData,
      );

      toast.success(response.data.message || "تم إنشاء الحساب بنجاح! 🎉", {
        toastId: "register_success",
      });

      // توجيه المستخدم لصفحة تسجيل الدخول بعد ثانيتين من النجاح
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // عرض رسالة الخطأ القادمة من السيرفر (مثل: الإيميل مستخدم مسبقاً)
      const errorMsg = error.response?.data?.message || "حدث خطأ أثناء التسجيل";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: "15px" }}>
          <Typography
            component="h1"
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 3, color: "#006722" }}
          >
            إنشاء حساب جديد
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="الاسم الكامل"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="البريد الإلكتروني"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="رقم الهاتف"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="مثال: 0791234567"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm_password"
              label="تأكيد كلمة المرور"
              type="password"
              autoComplete="current-password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="account-type-label">نوع الحساب</InputLabel>
              <Select
                labelId="account-type-label"
                label="نوع الحساب"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="user">مستخدم</MenuItem>
                <MenuItem value="owner">صاحب ملعب</MenuItem>
              </Select>
            </FormControl>
            {formData.role === "owner" && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" sx={{ mt: 2, color: "#006722" }}>
                  بيانات الملعب وإثبات ملكية أو استثمار الملعب
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ mt: 2, borderRadius: "20px" }}
                >
                  {formData.ownershipProof
                    ? formData.ownershipProof.name
                    : "إرفاق سند ملكية أو عقد استثمار الملعب"}
                  <input
                    hidden
                    required
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleProofChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  يجب أن يثبت المستند علاقتك بهذا الملعب، مثل سند ملكية أو عقد إيجار/استثمار.
                  PDF أو JPG أو PNG، بحد أقصى 10MB.
                </Typography>
              </Box>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: "20px",
                p: 1,
                fontWeight: "bold",
              }}
            >
              {loading ? "جاري التسجيل..." : "تسجيل الحساب"}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              لديك حساب بالفعل؟{" "}
              <Link
                to="/login"
                style={{
                  color: "#006722",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                تسجيل الدخول
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
