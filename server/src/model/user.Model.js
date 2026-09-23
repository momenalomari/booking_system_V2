import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashed_Password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
    role: {
      type: String,
      enum: ["user", "admin", "field_manager", "owner"],
      default: "user",
    },
    approvalStatus:{
      type : String,
      enum : ["pending","approved","rejected"],
      default : "approved"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;