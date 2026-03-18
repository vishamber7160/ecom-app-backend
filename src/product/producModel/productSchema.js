import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    description: {
      type: String,
      required: [true, "Description is required"]
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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

    lowStockThreshold: {
      type: Number,
      default: 5
    },

    // Variants (size, color, etc.)
    variants: [
      {
        sku: {
          type: String
        },
        size: String,
        color: String,
        price: Number,
        stock: Number
      }
    ],

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true
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

    // Images
    images: [
      {
        url: {
          type: String,
          required: true
        },
        alt: String
      }
    ],

    // Video Support
    video: {
      url: String,
      thumbnail: String
    },

    tags: [
      {
        type: String
      }
    ],

    // SEO Fields
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    },

    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active"
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// 🔥 Auto sulg update calculate final price (for save & update)
productSchema.pre(["save", "findOneAndUpdate"], function (next) {

  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    });
  }

  const update = this._update;

  if (update.title) {
    update.slug = slugify(update.title, {
      lower: true,
      strict: true
    });
  }

  const doc = this._update || this;

  if (doc.price !== undefined && doc.discount !== undefined) {
    doc.finalPrice =
      doc.price - (doc.price * doc.discount) / 100;
  }

  next();
});

// 🔥 Indexing for performance & search
productSchema.index({ title: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;