import express from "express";
import {
  createField,
  getFieldsByManager, // الدالة الجديدة التي تمت إضافتها
  getAllFields,
  getFieldById,
  updateField,
  deleteField 
} from "../controller/field.controller.js";   

const FieldRouter = express.Router();

FieldRouter.post("/create_field", createField);
FieldRouter.get("/manager_fields/:managerId", getFieldsByManager); // المسار الخاص بصاحب الملعب
FieldRouter.get("/all_fields", getAllFields);
FieldRouter.get("/field/:id", getFieldById);
FieldRouter.put("/update_field/:id", updateField);
FieldRouter.delete("/delete_field/:id", deleteField);

export default FieldRouter;