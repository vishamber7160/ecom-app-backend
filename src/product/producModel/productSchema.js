import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      required: [true, "Description is required"]
    },

    category: {
      type: String,
      required: true,
      index: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    finalPrice: {
      type: Number
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    images: [
      {
        url: {
          type: String,
          required: true
        },
        alt: String
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active"
    },

    tags: [
      {
        type: String
      }
    ],

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


// Auto calculate final price
productSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
});

const Product = mongoose.model("Product", productSchema);

export default Product;