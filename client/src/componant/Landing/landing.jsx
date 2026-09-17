import React from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "90vh",
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://i.pinimg.com/1200x/f9/ae/7b/f9ae7b7d06b08c85aff75c24db06d767.jpg")',
        backgroundSize: "cover", // قمنا بتغيير هذه الكلمة
        backgroundRepeat: "no-repeat", // أضفنا هذا السطر لمنع تكرار الصورة
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#FFD700",
            textShadow: "2px 2px 4px rgba(255, 255, 255, 0.5)",
          }}
        >
          احجز ملعبك المفضل في ثوانٍ
        </Typography>

        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          نظام حجز الملاعب الأسرع في إربد.. اختر وقتك، ادفع، وانطلق للعب!
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            component={Link}
            to={"/fields"}
            color="success"
            size="large"
            startIcon={<SportsSoccerIcon />}
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem", borderRadius: "30px" }}
          >
            استعرض الملاعب
          </Button>
          <Button
            component={Link}
            to={"/contact"}
            variant="outlined"
            color="inherit"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem", borderRadius: "30px", border: "2px solid", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            تواصل معنا
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
