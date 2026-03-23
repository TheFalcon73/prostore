'use server'
import { prisma } from "@/db/prisma"
import { convertToPlainObject } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";


// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: LATEST_PRODUCTS_LIMIT
  });
  return convertToPlainObject(data);
}

// Get product by Slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug: slug
    }
  });
   //  return convertToPlainObject(data);
}