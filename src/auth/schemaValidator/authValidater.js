import { email, z } from "zod"

export const signupSchema = z.object({

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can contain only letters, numbers and underscore"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[a-z]/, "Password must contain one lowercase letter")
    .regex(/[0-9]/, "Password must contain one number"),

  mobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),

  role: z
    .enum(["customer", "seller"])
    .optional()

})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
});

export const updateUserSchema = z.object({

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_ ]+$/, "Username can contain only letters, numbers, spaces and underscore")
    .optional(),

  mobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .optional(),

  profileImage: z
    .string()
    .url("Profile image must be a valid URL")
    .optional(),

  address: z.object({

    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City must be at least 2 characters")
      .optional(),

    state: z
      .string()
      .trim()
      .min(2, "State must be at least 2 characters")
      .optional(),

    pincode: z
      .string()
      .trim()
      .regex(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .optional(),

    country: z
      .string()
      .trim()
      .min(2, "Country must be at least 2 characters")
      .optional(),

    addressLine: z
      .string()
      .trim()
      .min(5, "Address line must be at least 5 characters")
      .optional(),

    isDefault: z
      .boolean()
      .optional()

  }).optional()

})