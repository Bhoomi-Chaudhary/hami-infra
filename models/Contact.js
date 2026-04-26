import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { 
    type: String, 
    required: true 
  },

  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Invalid phone number"],
  },

  service: { 
    type: String, 
    required: true 
  },

  message: { 
    type: String, 
    required: true 
  },

}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);