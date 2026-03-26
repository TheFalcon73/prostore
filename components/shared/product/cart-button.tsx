/* import AddToCart from "./add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";

const CartButton = async ({ item }: { item: CartItem }) => {
  const cart = await getMyCart();

  return <AddToCart cart={cart} item={item} />;
};

export default CartButton; */

import AddToCart from "./add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { unstable_cache } from "next/cache";

const CartButton = async ({ item }: { item: CartItem }) => {
  const cart = await unstable_cache(
    async () => getMyCart(),
    ["cart"],
    { tags: ["cart"] }
  )();

  return <AddToCart cart={cart} item={item} />;
};

export default CartButton;