import React from "react";
import { Button, Card, CardContent, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

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
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            لا توجد حجوزات قادمة
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            اختر ملعباً مناسباً وابدأ بحجز وقت اللعب مع أصدقائك.
          </Typography>
          <Button component={Link} to="/fields" variant="contained" color="success">
            استعرض الملاعب
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}