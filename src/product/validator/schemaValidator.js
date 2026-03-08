import {z} from "zod";

export const productSchema = z.object({

  title: z
    .string()
    .min(1, "Product title is required")
    .max(200, "Title must be less than 200 characters"),

  description: z
    .string()
    .min(1, "Description is required"),

  category: z
    .string()
    .min(1, "Category is required"),

  price: z
    .number()
    .min(0, "Price must be a positive number"),

  discount: z
    .number()
    .min(0, "Discount must be a positive number")
    .max(100, "Discount must be less than or equal to 100")
    .default(0),

  stock: z
    .number()
    .min(0, "Stock must be a positive number")
    .default(0),

  images: z
    .array(z.object({ url: z.string().url("Invalid image URL"), alt: z.string().optional() }))
    .optional(),

  tags: z
    .array(z.string())
    .optional(),

  sellerId: z
    .string()
    .optional()

});