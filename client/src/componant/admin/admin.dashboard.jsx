import React from "react";
import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import ManageUser from "./ManageUser.jsx";
import { useUser } from "../Hooks/useUser.js";

export default function AdminDashboard() {
  const { users, loading } = useUser();
  const owners = users.filter((user) => user.role === "owner").length;
  const admins = users.filter((user) => user.role === "admin").length;

  const stats = [
    { label: "إجمالي المستخدمين", value: users.length, icon: <PeopleAltOutlinedIcon />, color: "#2563eb" },
    { label: "أصحاب الملاعب", value: owners, icon: <SportsSoccerOutlinedIcon />, color: "#d97706" },
    { label: "المديرون", value: admins, icon: <AdminPanelSettingsOutlinedIcon />, color: "#7c3aed" },
  ];

  return (
    <Box sx={{ background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>لوحة التحكم</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>نظرة سريعة على الحسابات وإدارة المستخدمين.</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, display: "grid", placeItems: "center", color: stat.color, background: `${stat.color}15` }}>{stat.icon}</Box>
                  <Box><Typography color="text.secondary" variant="body2">{stat.label}</Typography><Typography variant="h5" sx={{ fontWeight: 800 }}>{loading ? "—" : stat.value}</Typography></Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <ManageUser />
    </Box>
  );
}
