import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { Link, useLocation, useNavigate } from "react-router-dom";

const publicPages = [
  { name: "الرئيسية", path: "/" },
  { name: "الملاعب", path: "/fields" },
  { name: "تسجيل الدخول", path: "/login" },
  { name: "إنشاء حساب", path: "/register" },
];
function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    handleCloseNavMenu();
    navigate("/login");
  };

  const pages = user
    ? [
        { name: "الرئيسية", path: "/" },
        { name: "الملاعب", path: "/fields" },
        user.role === "owner"
          ? { name: "لوحة المالك", path: "/owner/dashboard" }
          : user.role === "admin"
          ? { name: "لوحة الإدارة", path: "/admin/dashboard" }
          : { name: "لوحتي", path: "/user/dashboard" },
      ]
    : publicPages;

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "rgba(18,60,54,.96)",
        boxShadow: "0 4px 18px rgba(0,0,0,.12)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              color: "white",
              textDecoration: "none",
            }}
          >
            <SportsSoccerIcon sx={{ color: "#fbbf24", fontSize: 34 }} />
            <Typography
              sx={{ fontWeight: 800, fontSize: { xs: "1rem", md: "1.25rem" } }}
            >
              ملعبك
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={Link} // 👈 تحويله لرابط
                  to={page.path} // 👈 توجيهه للمسار
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
              {user && (
                <MenuItem onClick={handleLogout}>
                  <Typography sx={{ textAlign: "center" }}>
                    تسجيل الخروج
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              mx: 20,
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.path}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 1,
                  mx: 0.5,
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  "&:hover": {
                    color: "#fbbf24",
                    background: "rgba(255,255,255,.08)",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
            {user && (
              <Button
                onClick={handleLogout}
                sx={{
                  my: 1,
                  mx: 0.5,
                  color: "#fbbf24",
                  fontWeight: 700,
                  borderRadius: 2,
                  "&:hover": { background: "rgba(255,255,255,.08)" },
                }}
              >
                تسجيل الخروج
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
