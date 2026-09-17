import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        background: "#123c36", 
        color: "white", 
        py: 4, 
        position: "fixed", // التثبيت
        bottom: 0, // الإلصاق بالحافة السفلية
        left: 0,
        width: "100%", // أخذ عرض الشاشة بالكامل
        zIndex: 1000, // لضمان بقائه فوق باقي عناصر الصفحة
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center" 
      }}
    >
      <Box 
        sx={{ 
          maxWidth: 1200, 
          mx: "auto", 
          px: { xs: 3, md: 5 }, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          gap: 2 
        }}
      >
        
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;