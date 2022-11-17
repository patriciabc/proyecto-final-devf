import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Administrator', 'Employee', 'Customer'],
    default: 'Employee',
    required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: Date,
  isVerificate: {
    type:Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("User", schema);

