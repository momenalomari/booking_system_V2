import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddField = () => {
  // جلب بيانات صاحب الملعب من التخزين المحلي (بافتراض أنك تخزنها عند تسجيل الدخول)
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const managerId = user._id;

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "football",
    pricePerHour: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!managerId) {
      toast.error(
        "خطأ: لم يتم العثور على بيانات حسابك، يرجى تسجيل الدخول مجدداً.",
      );
      return;
    }

    setLoading(true);
    try {
      // إرسال البيانات مع managerId للباك إند
      await axios.post(
        "https://booking-system-v2-backend.onrender.com/api/fields/create_field",
        {
          ...formData,
          managerId: managerId,
        },
      );

      toast.success("تم إضافة الملعب بنجاح! 🏟️");

      // تفريغ الحقول بعد النجاح
      setFormData({
        name: "",
        location: "",
        type: "football",
        pricePerHour: "",
        description: "",
        image: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "حدث خطأ أثناء الإضافة";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        color: "#fff",
        backgroundColor: "#1e1e2f",
        minHeight: "100vh",
        direction: "rtl",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          borderBottom: "2px solid #333",
          paddingBottom: "10px",
        }}
      >
        إضافة ملعب جديد
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "500px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="اسم الملعب"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #444",
            background: "#2a2a3c",
            color: "#fff",
          }}
        />

        <input
          type="text"
          name="location"
          placeholder="الموقع (مثال: إربد - شارع الجامعة)"
          value={formData.location}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #444",
            background: "#2a2a3c",
            color: "#fff",
          }}
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #444",
            background: "#2a2a3c",
            color: "#fff",
          }}
        >
          <option value="football">كرة قدم</option>
          <option value="basketball">كرة سلة</option>
          <option value="padel">بادل</option>
          <option value="tennis">تنس</option>
        </select>

        <input
          type="number"
          name="pricePerHour"
          placeholder="السعر بالساعة (دينار)"
          value={formData.pricePerHour}
          onChange={handleChange}
          required
          min="0"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #444",
            background: "#2a2a3c",
            color: "#fff",
          }}
        />

        <textarea
          name="description"
          placeholder="وصف الملعب والمرافق..."
          value={formData.description}
          onChange={handleChange}
          rows="4"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #444",
            background: "#2a2a3c",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#198754",
            color: "white",
            padding: "12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "جاري الإضافة..." : "إضافة الملعب"}
        </button>
      </form>
    </div>
  );
};

export default AddField;
