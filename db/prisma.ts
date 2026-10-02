import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import "dotenv/config"

neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "The DATABASE_URL variable is not specified in the .env file!",
  )
}

const adapter = new PrismaNeon({ connectionString })

const basePrisma = new PrismaClient({ adapter })

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  basePrisma.$extends({
    result: {
      product: {
        price: {
          compute(product: {
            price: import("@prisma/client/runtime/library").Decimal
          }) {
            return product.price ? product.price.toString() : "0"
          },
        },
        rating: {
          compute(product: {
            rating: number | import("@prisma/client/runtime/library").Decimal
          }) {
            return product.rating ? product.rating.toString() : "0"
          },
        },
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
