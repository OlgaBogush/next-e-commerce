"use server"

import { CartItem } from "@/types"
import { cookies } from "next/headers"
import { formatError } from "../utils"

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value

    return {
      success: true,
      message: "Item added to cart (custom msg)",
    }
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    }
  }
}
