import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container, Paper } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify"; // استخدمنا نفس المكتبة الموحدة
import { useNavigate, Link } from "react-router-dom"; // للتوجيه

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // منع الريفريش

    if (!formData.email || !formData.password) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      // إرسال الطلب للباك إند
      const res = await axios.post("http://localhost:5000/api/users/login", formData);

      toast.success(res.data.message || "تم تسجيل الدخول بنجاح! ⚽", {
        toastId: "login_success"
      });

      // 🔑 الخطوة الذهبية: حفظ التوكن في المتصفح
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      const Token = res.data.Token;
      localStorage.setItem("token", Token);
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        // توجيه المستخدم لصفحة الملاعب بعد الدخول
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 1500);
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh" }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: "15px" }}>
          <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3, color: "#006722" }}>
            تسجيل الدخول
          </Typography>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="كلمة المرور"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              disabled={loading}
              sx={{ mt: 3, mb: 2, borderRadius: "20px", p: 1, fontWeight: "bold" }}
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              ليس لديك حساب؟{" "}
              <Link to="/register" style={{ color: "#006722", fontWeight: "bold", textDecoration: "none" }}>
                إنشاء حساب جديد
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 
