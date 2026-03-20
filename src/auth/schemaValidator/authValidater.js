import { z } from "zod"

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

  addresses: z.array(
  z.object({
     fullName:z.string().min(3),
     phone:z.string().regex(/^[0-9]{10}$/),
     city:z.string().min(2),
     state:z.string().min(2),
     pincode:z.string().regex(/^[0-9]{6}$/),
     country:z.string().min(2),
     addressLine:z.string().min(5),
     isDefault:z.boolean().optional()
  })
).optional()

})


// const forgotValidation = z.object({

// })