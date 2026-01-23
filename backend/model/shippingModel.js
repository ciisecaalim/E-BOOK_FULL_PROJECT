import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Shipping", shippingSchema);
