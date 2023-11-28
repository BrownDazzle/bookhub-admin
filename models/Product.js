import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    category: { type: String, required: true, },
    title: { type: String, required: true, },
    manufacturer: { type: String, required: true, },
    desc: { type: String },
    cover: { type: String, required: true },
    quantity: { type: Number, required: true },
    tags: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true }
  }
  ,
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
