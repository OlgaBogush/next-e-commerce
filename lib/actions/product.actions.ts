"use server"

import { prisma } from "@/db/prisma"
import { convertToPlainObject } from "../utils"
import { LATEST_PRODUCTS_LIMIT } from "../constants"

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  })
  return data.map((product) => ({
    ...convertToPlainObject(product),
    price: product.price.toString(),
    rating: product.rating.toString(),
  }))
}

export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findFirst({
    where: { slug: slug },
  })

  if (!data) return null
  const plainData = convertToPlainObject(data)

  return {
    ...plainData,
    price: data.price.toString(),
    rating: data.rating.toString(),
  }
}
