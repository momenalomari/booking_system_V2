import User from "../model/user.Model.js";

// 1. دالة جلب طلبات أصحاب الملاعب المعلقة
export const getPendingManagers = async (req, res) => {
  try {
    const pendingManagers = await User.find({
      role: "field_manager",
      approvalStatus: "pending",
    }).select("-password");

    res.status(200).json({
      message: "تم جلب الطلبات المعلقة بنجاح",
      count: pendingManagers.length,
      requests: pendingManagers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. دالة الموافقة أو الرفض على الطلب
export const reviewManagerRequest = async (req, res) => {
  try {
    const { id } = req.params; 
    const { action } = req.body;

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({ message: "قرار غير صالح." });
    }

    const updatedManager = await User.findOneAndUpdate(
      { _id: id, role: "field_manager" }, 
      { approvalStatus: action },
      { new: true }
    ).select("-password");

    // التأكد من أن المستخدم موجود في قاعدة البيانات
    if (!updatedManager) {
      return res.status(404).json({ message: "صاحب الملعب غير موجود أو الحساب ليس لصاحب ملعب" });
    }

    // إرسال رد النجاح للفرونت إند
    res.status(200).json({
      message: `تم تحديث حالة الطلب إلى: ${action}`,
      manager: updatedManager,
    });

  } catch (error) {
    // اصطياد الأخطاء وإرسالها لمنع توقف السيرفر
    res.status(500).json({ message: error.message });
  }
};