import { z } from "zod";

export const productSchema = z.object({

  title: z
    .string()
    .trim()
    .min(1, "Product title is required")
    .max(200, "Title must be less than 200 characters"),

  slug: z
    .string()
    .trim()
    .min(1),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required"),

  price: z
    .coerce.number()
    .min(0, "Price must be a positive number"),

  discount: z
    .coerce.number()
    .min(0, "Discount must be a positive number")
    .max(100, "Discount must be ≤ 100")
    .default(0),

  stock: z
    .coerce.number()
    .min(0, "Stock must be a positive number")
    .default(0),

  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        alt: z.string().trim().optional()
      })
    )
    .min(1, "At least one product image is required"),

  tags: z
    .array(z.string().trim())
    .optional(),

  // REMOVE sellerId from client input
  // sellerId will be injected in controller

  status: z
    .enum(["active", "inactive", "out_of_stock", "draft"])
    .default("draft"),

  featured: z
    .coerce.boolean()
    .optional()

});