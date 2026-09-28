import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageFields = () => {
  const [pendingRequests, setPendingRequests] = useState([]);

  // 1. تعريف دالة الجلب أولاً
useEffect(() => {
    // 1. تعريف الدالة داخل useEffect مباشرة
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "https://booking-system-v2-backend.onrender.com/api/admin/field-managers/pending"
        );
        console.log("البيانات القادمة من السيرفر:", response.data);

        const data = response.data;
        let requestsArray = [];

        if (Array.isArray(data)) {
          requestsArray = data;
        } else if (data && typeof data === "object") {
          requestsArray =
            Object.values(data).find((val) => Array.isArray(val)) || [];
        }

        // تحديث الـ State
        setPendingRequests(requestsArray);
      } catch (error) {
        console.error("خطأ في جلب الطلبات:", error);
      }
    };

    // 2. استدعاء الدالة فوراً
    fetchRequests();
  }, []); // المصفوفة فارغة تضمن عمل الدالة مرة واحدة فقط عند فتح الصفحة

  // 3. دالة إرسال قرار الموافقة أو الرفض للسيرفر
  const handleReview = async (userId, action) => {
    try {
      await axios.patch(
        `https://booking-system-v2-backend.onrender.com/api/admin/field-managers/${userId}/review`,
        {
          action: action 
        }
      );

      toast.success(
        `تم ${action === "approved" ? "قبول" : "رفض"} صاحب الملعب بنجاح`
      );

      setPendingRequests((prev) => prev.filter((req) => req._id !== userId));
    } catch (error) {
      console.log("سبب الرفض من السيرفر:", error.response?.data);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء معالجة الطلب"
      );
    }
  };

  const hasRequests =
    Array.isArray(pendingRequests) && pendingRequests.length > 0;

  return (
    <div
      style={{
        padding: "30px",
        color: "#fff",
        backgroundColor: "#1e1e2f",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          borderBottom: "2px solid #333",
          paddingBottom: "10px",
        }}
      >
        طلبات أصحاب الملاعب (قيد الانتظار)
      </h2>

      {!hasRequests ? (
        <p style={{ color: "#aaa" }}>لا يوجد طلبات معلقة حالياً.</p>
      ) : (
        <table
          style={{
            width: "100%",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#2a2a3c" }}>
              <th style={{ padding: "15px" }}>الاسم</th>
              <th style={{ padding: "15px" }}>البريد الإلكتروني</th>
              <th style={{ padding: "15px" }}>رقم الهاتف</th>
              <th style={{ padding: "15px" }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((req) => (
              <tr key={req._id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "15px" }}>{req.name}</td>
                <td style={{ padding: "15px" }}>{req.email}</td>
                <td style={{ padding: "15px" }}>{req.phone}</td>
                <td style={{ padding: "15px" }}>
                  <button
                    onClick={() => handleReview(req._id, "approved")}
                    style={{
                      background: "#198754",
                      color: "white",
                      padding: "8px 15px",
                      marginRight: "10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    موافقة
                  </button>
                  <button
                    onClick={() => handleReview(req._id, "rejected")}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      padding: "8px 15px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    رفض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageFields;