"use server"

import { prisma } from "@/db/prisma"
import { convertToPlainObject } from "../utils"
import { LATEST_PRODUCTS_LIMIT } from "../constants"
import { Product } from "@prisma/client"

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  })

  const plainData = convertToPlainObject(data)

  return plainData as unknown as (Omit<Product, "price" | "rating"> & {
    price: string
    rating: string
  })[]
}

export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findFirst({
    where: { slug: slug },
  })

  if (!data) return null
  const plainData = convertToPlainObject(data)

  return plainData as unknown as Omit<Product, "price" | "rating"> & {
    price: string
    rating: string
  }
}
