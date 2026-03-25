import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "price must be a valid number with up to 2 decimal places.",
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  slug: z.string().min(3, "Slug must be at least 3 characters long."),
  category: z.string().min(3, "Category must be at least 3 characters long."),
  brand: z.string().min(3, "Brand must be at least 3 characters long."),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long."),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "At least one image URL is required."),
  isFeatured: z.boolean(),
  bannerImage: z.string().nullable(),
  price: currency,
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

// Schema for sign up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  export const cartItemSchema = z.object(
    { 
      productId: z.string().min(1, "Product is Required"),
      name: z.string().min(1, "Name is Required"),
      slug: z.string().min(1, "Slug is Required"),
      qty: z.number().int().nonnegative('Quantity must be a positive number'),
      image: z.string().min(1, "Image is Required"),
      price: currency
    });

  export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,      
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart is is required'),
    userId: z.string().optional().nullable()
  });
  
