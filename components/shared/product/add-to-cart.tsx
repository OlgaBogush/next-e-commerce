"use client"

import { Button } from "@/components/ui/button"
import { CartItem } from "@/types"
import { toast } from "@/components/ui/toast"
import { addItemToCart } from "@/lib/actions/cart.actions"
import { Plus } from "lucide-react"

const AddToCart = ({ item }: { item: CartItem }) => {
  const handleAddToCart = async () => {
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
      description: `${item.name} added to cart`,
    })
  }

  return (
    <Button
      className="w-full flex items-center justify-center gap-2"
      type="button"
      onClick={handleAddToCart}
    >
      <Plus className="h-4 w-4 shrink-0" /> Add To Cart
    </Button>
  )
}

export default AddToCart
