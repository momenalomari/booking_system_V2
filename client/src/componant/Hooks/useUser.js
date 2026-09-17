import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. دخلنا الـ useEffect جوا دالة useUser
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/users",
        );
        // حاول الوصول لاسم الخاصية الصحيح (مثلاً data أو users)
        setUsers(response.data.users || response.data || []);

        const loadedUsers = response.data.users || response.data || [];
        if (loadedUsers.length === 0) {
          toast.warn("لا يوجد مستخدمين حالياً ⚠️", {
            toastId: "warning_no_users",
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("عذراً، حدث خطأ في الاتصال بالسيرفر ❌", {
          toastId: "error_fetch_users",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // 2. ضفنا الأقواس المربعة هون عشان الكود يشتغل مرة وحدة بس أول ما تفتح الصفحة

  const updateUser = async (id, data) => {
    const response = await axios.patch(
      `http://localhost:5000/api/users/${id}`,
      data,
    );
    const updatedUser = response.data.user || response.data;
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user._id === id ? updatedUser : user)),
    );
    return updatedUser;
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    setUsers((currentUsers) => currentUsers.filter((user) => user._id !== id));
  };

  // 3. ضفنا سطر الإرجاع عشان نقدر نستخدم البيانات بالداشبورد
  return { users, loading, updateUser, deleteUser };
}; // 4. نقلنا قوس النهاية لهون
