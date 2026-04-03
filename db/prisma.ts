/* import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Instantiates the Prisma adapter using just the connection string.
// No need for Pool, neonConfig, or ws setup in Prisma 7+.
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      taxPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      totalPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      taxPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      totalPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        compute(cart) {
          return cart.price.toString();
        },
      },
    },
  },
});
 */

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        needs: { price: true },
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        needs: { rating: true },
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true }, // ← was itemsPrice
        compute(cart) {
          return cart.taxPrice.toString(); // ← was cart.itemsPrice
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true }, // ← was itemsPrice
        compute(cart) {
          return cart.shippingPrice.toString(); // ← was cart.itemsPrice
        },
      },
      totalPrice: {
        needs: { totalPrice: true }, // ← was itemsPrice
        compute(cart) {
          return cart.totalPrice.toString(); // ← was cart.itemsPrice
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(order) {
          return order.itemsPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true }, // ← was itemsPrice
        compute(order) {
          return order.taxPrice.toString(); // ← was cart.itemsPrice
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true }, // ← was itemsPrice
        compute(order) {
          return order.shippingPrice.toString(); // ← was cart.itemsPrice
        },
      },
      totalPrice: {
        needs: { totalPrice: true }, // ← was itemsPrice
        compute(order) {
          return order.totalPrice.toString(); // ← was cart.itemsPrice
        },
      },
    },
    orderItem: {
      price: {
        needs: { price: true }, // ← was missing
        compute(orderItem) {
          return orderItem.price.toString();
        },
      },
    },
  },
});