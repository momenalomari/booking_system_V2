import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import { useUser } from "../Hooks/useUser.js";

const emptyForm = { name: "", email: "", phone: "", role: "user" };

export default function ManageUser() {
  const { users, loading, updateUser, deleteUser } = useUser();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.phone]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (roleFilter === "all" || user.role === roleFilter);
    });
  }, [users, search, roleFilter]);

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("الاسم والبريد ورقم الهاتف حقول مطلوبة");
      return;
    }
    setSaving(true);
    try {
      await updateUser(editingUser._id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
      });
      toast.success("تم تحديث بيانات المستخدم");
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث بيانات المستخدم");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`هل أنت متأكد من حذف حساب ${user.name}؟`)) return;
    setDeletingId(user._id);
    try {
      await deleteUser(user._id);
      toast.success("تم حذف المستخدم");
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر حذف المستخدم");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1400, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>إدارة المستخدمين</Typography>
          <Typography color="text.secondary">راجع بيانات الحسابات وحدّث الصلاحيات أو احذف الحسابات غير المطلوبة.</Typography>
        </Box>
        <Chip label={`${users.length} مستخدم`} color="primary" variant="outlined" />
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: "1px solid #e5e7eb", borderRadius: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="بحث بالاسم أو البريد أو الهاتف"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ flex: 1, minWidth: 240 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
          />
          <TextField select size="small" label="نوع الحساب" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="all">كل الحسابات</MenuItem>
            <MenuItem value="user">مستخدم</MenuItem>
            <MenuItem value="owner">صاحب ملعب</MenuItem>
            <MenuItem value="admin">مدير</MenuItem>
          </TextField>
          <Tooltip title="تحديث القائمة">
            <IconButton color="primary" onClick={() => window.location.reload()}><RefreshIcon /></IconButton>
          </Tooltip>
        </Box>

        {loading ? (
          <Box sx={{ py: 8, textAlign: "center" }}><CircularProgress color="success" /></Box>
        ) : filteredUsers.length === 0 ? (
          <Alert severity="info">لا يوجد مستخدمون مطابقون للبحث.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell><TableCell>الاسم</TableCell><TableCell>البريد الإلكتروني</TableCell>
                  <TableCell>الهاتف</TableCell><TableCell>نوع الحساب</TableCell><TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow hover key={user._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "غير مسجل"}</TableCell>
                    <TableCell><Chip size="small" label={user.role === "owner" ? "صاحب ملعب" : user.role === "admin" ? "مدير" : "مستخدم"} color={user.role === "owner" ? "warning" : "default"} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="تعديل">
                        <IconButton color="primary" onClick={() => openEdit(user)}><EditOutlinedIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="حذف">
                        <span><IconButton color="error" disabled={deletingId === user._id} onClick={() => handleDelete(user)}><DeleteOutlineIcon /></IconButton></span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={Boolean(editingUser)} onClose={() => !saving && setEditingUser(null)} fullWidth maxWidth="sm">
        <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="الاسم" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <TextField fullWidth margin="dense" label="البريد الإلكتروني" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <TextField fullWidth margin="dense" label="رقم الهاتف" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <TextField fullWidth select margin="dense" label="نوع الحساب" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <MenuItem value="user">مستخدم</MenuItem><MenuItem value="owner">صاحب ملعب</MenuItem><MenuItem value="admin">مدير</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditingUser(null)} disabled={saving}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
