import { z } from "zod";

export const createSellerSchema = z.object({

    storeName: z
        .string()
        .min(2, "Store name must be at least 2 characters")
        .max(100, "Store name must be less than 100 characters"),

    imageProfile: z
        .string()
        .url("Invalid image URL")
        .optional(),

    phone: z
        .string()
        .regex(/^\d{10}$/, "Phone must be 10 digits"),

    email: z
        .string()
        .email("Invalid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    address: z.object({

        country: z.string().max(100).optional(),

        state: z.string().max(100).optional(),

        city: z.string().max(100).optional(),

        pincode: z
            .string()
            .regex(/^\d{6}$/, "Pincode must be 6 digits")
            .optional(),

        fullAddress: z
            .string()
            .max(200)
            .optional()

    }).optional(),

    gstNumber: z
        .string()
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/, "Invalid GST number")
        .optional(),

    panNumber: z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
        .optional(),

    bankDetails: z.object({

        accountHolderName: z
            .string()
            .max(100)
            .optional(),

        accountNumber: z
            .string()
            .regex(/^\d{9,18}$/, "Invalid account number")
            .optional(),

        ifscCode: z
            .string()
            .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
            .optional(),

        bankName: z
            .string()
            .max(100)
            .optional()

    }).optional()

});

export const loginValidationSchema = z.object({

    email: z
        .string()
        .email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
});