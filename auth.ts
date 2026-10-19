import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/db/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compareSync } from "bcrypt-ts-edge"
import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        // find the user in the database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        })

        // check if the user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          )
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        // if the user does not exist or password does not match return null
        return null
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    // back
    async jwt({ user, token, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0]
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          })
        }

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies()
          const sessionCartId = cookiesObject.get("sessionCartId")?.value

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            })
            if (sessionCart) {
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id,
                },
              })
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              })
            }
          }
        }
      }

      if (session?.user.name && trigger === "update") {
        token.name = session.user.name
      }

      return token
    },

    // bridge to the front
    async session({ session, user, trigger, token }) {
      // set the user id from the token
      session.user.id = token.sub || ""
      const userSession = session.user as {
        id: string
        role?: string
        name?: string | null
      }
      userSession.role = token.role as string
      userSession.name = token.name

      // if there is an update, set the user name
      if (trigger == "update") {
        session.user.name = user.name
      }
      return session
    },

    authorized({ request }) {
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID()
        const requestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
        response.cookies.set("sessionCartId", sessionCartId)
        return response
      } else {
        return true
      }
    },
  },
} satisfies NextAuthConfig

export const { auth, handlers, signIn, signOut } = NextAuth(config)
