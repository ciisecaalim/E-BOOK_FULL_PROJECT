import Shipping from "../model/shippingModel.js";

// GET all shipping options
export const readShipping = async (req, res) => {
  try {
    const shippingOptions = await Shipping.find();
    res.json(shippingOptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE shipping option (admin)
export const createShipping = async (req, res) => {
  try {
    const { type, price } = req.body;
    const shipping = new Shipping({ type, price });
    res.status(201).json(await shipping.save());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE shipping option
export const updateShipping = async (req, res) => {
  try {
    const updated = await Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE shipping option
export const deleteShipping = async (req, res) => {
  try {
    await Shipping.findByIdAndDelete(req.params.id);
    res.json({ message: "Shipping option deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
