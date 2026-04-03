"use server";

import { CartItem } from "@/types";

import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

// Calculate Cart Prices
 const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}; 



 export async function addItemToCart(data: CartItem) {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart Session not Found");

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get the cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not in the database");

    if (!cart) {
      // Create a new cart
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate the product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Cart Already Exist
      // Check if Item is already in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => (x.productId === item.productId),
      );

      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }
        // Increase the quantity
        (cart.items as CartItem[]).find(
          (x) => (x.productId === item.productId),
        )!.qty = existItem.qty + 1;
      } else {
        // If Item does not exist in cart
        // Check stock
        if (product.stock < 1) throw new Error("Not enough stock");
        // Add the item to the cart.items
        cart.items.push(item);
      }


      // Save to the database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },  
      });
      // Revalidate the product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? "updated in" : "added to "} cart`,
      };
    }
  } catch (error) {
    //console.log(error)
    return {
      success: false,
      message: formatError(error),
    };
  }
} 



/* export async function getMyCart() {
  // Check for the cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart Session not Found");

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  //// Start bug note ////
  /// The next part of the code is bugged with Prsima Client
  /// I have added a new version of getMyCart with a Raw query instead of this
 //// End bug note ////
 
  // if we do have a cart, the convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });

}  */

 export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart Session not Found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  const rawPrices = await prisma.$queryRaw<Array<{
    itemsPrice: string;
    totalPrice: string;
    taxPrice: string;
    shippingPrice: string;
  }>>`
    SELECT "itemsPrice", "totalPrice", "taxPrice", "shippingPrice"
    FROM "Cart"
    WHERE id = ${cart.id}::uuid
  `;

  const prices = rawPrices[0];

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: prices.itemsPrice,
    totalPrice: prices.totalPrice,
    shippingPrice: prices.shippingPrice,
    taxPrice: prices.taxPrice,
  });
} 

export async function removeItemFromCart (productId: string) {
  try{
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not Found");

    // Get the product
    const product = await prisma.product.findFirst({
      where: {id:productId}
    });
    if (!product) throw new Error('Product not found')

    // Get users cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found')

    // Check for item inside cart
    const exist = (cart.items as CartItem[]).find((x) => x.productId === productId) 
    if (!exist) throw new Error('Item not found in the cart')

    // Check if item quantity is equal to 1, then remove it
    if (exist.qty === 1) {
      // Remove it from cart
      cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId)
    } else {
      // item quantity is grater than 1, them decreese the qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = exist.qty -1;
    }

    // Update the cart in database
    await prisma.cart.update({
      where: {id: cart.id},
      data: {items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
      }
    })

    // Revalidate the product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`
    }

  }catch (error){
    return {
      success: false, message: formatError(error)
    }
  }
}