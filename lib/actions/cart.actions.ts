"use server"

import { CartItem } from "@/types"
import { cookies } from "next/headers"
import { convertToPlainObject, formatError, round2 } from "../utils"
import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { cartItemSchema, insertCartSchema } from "../validators"
import { revalidatePath } from "next/cache"

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  )
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
  const taxPrice = round2(0.15 * itemsPrice)
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

export async function addItemToCart(data: CartItem) {
  try {
    // important
    const sessionCartId = (await cookies()).get("sessionCartId")?.value
    if (!sessionCartId) throw new Error("Cart session not found")

    const authorizedUser = await auth()
    const userId = authorizedUser?.user?.id
      ? (authorizedUser.user.id as string)
      : undefined

    const cart = await getMyCart()
    const item = cartItemSchema.parse(data)
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    })

    if (!product) throw new Error("Product not found")

    if (!cart) {
      const newCart = insertCartSchema.parse({
        items: [item],
        ...calcPrice([item]),
        sessionCartId: sessionCartId,
        userId: userId,
      })

      await prisma.cart.create({
        data: newCart,
      })

      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: "Item added to cart (custom msg)",
      }
    }
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    }
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value
  if (!sessionCartId) throw new Error("Cart session not found")

  const authorizedUser = await auth()
  const userId = authorizedUser?.user?.id
    ? (authorizedUser.user.id as string)
    : undefined

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  })

  if (!cart) return undefined

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}
