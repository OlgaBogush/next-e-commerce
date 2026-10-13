"use client"

import { Button } from "@/components/ui/button"
import { Cart, CartItem } from "@/types"
import { toast } from "@/components/ui/toast"
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions"
import { Minus, Plus, Loader } from "lucide-react"
import { useTransition } from "react"

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item)

      if (!res.success) {
        toast.add({
          type: "error",
          title: "Error",
          description: res.message,
        })
        return
      }

      toast.add({
        type: "success",
        title: "Success",
        description: res.message,
      })
    })
  }

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId)

      if (!res.success) {
        toast.add({
          type: "error",
          title: "Error",
          description: res.message,
        })
        return
      }

      toast.add({
        type: "success",
        title: "Success",
        description: res.message,
      })

      return
    })
  }

  // check if item is in a cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId)

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full flex items-center justify-center gap-2"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}{" "}
      Add To Cart
    </Button>
  )
}

export default AddToCart
