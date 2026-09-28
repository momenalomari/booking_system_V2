import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // 1. استدعاء أداة إطلاق التوست

export const useFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(
          "https://booking-system-v2-backend.onrender.com/api/fields/all_fields",
        );
        setFields(response.data);
        if (response.data.length === 0) {
          // 2. إطلاق توست التحذير الأصفر مع منع التكرار
          toast.warn("لا توجد ملاعب متاحة حالياً ⚠️", {
            toastId: "warning_no_fields", // هذا السطر بيمنع ظهورها مرتين بنفس اللحظة
          });
        } 

       
        // 2. إطلاق توست النجاح الأخضر مع منع التكرار
        toast.success("تم جلب الملاعب بنجاح! ⚽", {
          toastId: "success_fetch_fields", // هذا السطر بيمنع ظهورها مرتين بنفس اللحظة
        });
      } catch (error) {
        console.error("حدث خطأ في جلب الملاعب:", error);

        // 3. إطلاق توست الخطأ الأحمر
        toast.error("عذراً، حدث خطأ في الاتصال بالسيرفر ❌", {
          toastId: "error_fetch_fields", // هذا السطر بيمنع ظهورها مرتين بنفس اللحظة
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  return { fields, loading };
};
