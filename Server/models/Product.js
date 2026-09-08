const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: 200,
    },
    image: {
      type: String,
      required: [true, "Item image is required"],
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Price cannot be negative"],
    },
    buyUrl: {
      type: String,
      required: [true, "Buy link is required"],
      trim: true,
      match: [/^https?:\/\/.+/, "Buy link must be a valid URL"],
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Look title is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    mainImage: {
      type: String, // full outfit photo
      required: [true, "Main image is required"],
    },
    items: {
      type: [itemSchema], // shoppable items within the look
      validate: [(arr) => arr.length > 0, "At least one item is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

module.exports = mongoose.model("Product", productSchema);