import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    // 👇 هذا هو السطر الأهم اللي ضفناه لربط الملعب بصاحبه
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // لازم يطابق اسم الموديل تبع المستخدمين
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["football", "basketball", "padel", "tennis"],
      default: "football",
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Field = mongoose.model("Field", fieldSchema);

export default Field;
