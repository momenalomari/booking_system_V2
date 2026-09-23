import Field from "../model/Field.Model.js";

// 1. إضافة ملعب جديد (مع ربطه بصاحب الملعب)
const createField = async (req, res) => {
  try {
    const { managerId, name, location, type, pricePerHour, description, image } = req.body;

    // حماية إضافية: التأكد من وجود صاحب للملعب
    if (!managerId) {
      return res.status(400).json({ message: "يجب تحديد صاحب الملعب (managerId)" });
    }

    const newField = new Field({
      managerId, // ربط الملعب بالـ ID الخاص بالمدير
      name,
      location,
      type,
      pricePerHour,
      description,
      image,
    });
    
    await newField.save();
    res.status(201).json(newField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. جلب الملاعب الخاصة بمدير معين فقط (للوحة تحكم صاحب الملعب)
const getFieldsByManager = async (req, res) => {
  try {
    const { managerId } = req.params;
    
    const fields = await Field.find({ managerId });
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. جلب جميع الملاعب (للأدمن أو الزبائن) مع اسم صاحب الملعب
const getAllFields = async (req, res) => {
  try {
    const fields = await Field.find().populate("managerId", "name email phone");
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. جلب ملعب محدد بالـ ID مع اسم صاحب الملعب
const getFieldById = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id).populate(
      "managerId",
      "name email phone",
    );
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. تعديل بيانات الملعب
const updateField = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // فحص ذكي للاسم: لا تفحص الداتابيز إلا إذا المستخدم فعلاً غيّر الاسم
    if (req.body.name && req.body.name !== field.name) {
      const isExist = await Field.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
      if (isExist) {
        return res.status(409).json({ message: "Field name already exists" });
      }
    }

    field.name = req.body.name || field.name;
    field.location = req.body.location || field.location;
    field.type = req.body.type || field.type;
    field.pricePerHour = req.body.pricePerHour || field.pricePerHour;
    field.description = req.body.description || field.description;
    field.image = req.body.image || field.image;
    
    field.isAvailable =
      req.body.isAvailable !== undefined
        ? req.body.isAvailable
        : field.isAvailable;

    const updatedField = await field.save();
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. حذف الملعب
const deleteField = async (req, res) => {
  try {
    const deletedField = await Field.findByIdAndDelete(req.params.id);
    
    if (!deletedField) {
      return res.status(404).json({ message: "Field not found" });
    }
    
    res.status(200).json({ message: "Field deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تصدير جميع الدوال لتصبح جاهزة للاستخدام في ملف الـ Routes
export { 
  createField, 
  getFieldsByManager, 
  getAllFields, 
  getFieldById, 
  updateField, 
  deleteField 
};