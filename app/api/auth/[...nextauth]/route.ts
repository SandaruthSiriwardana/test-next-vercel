import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../../../src/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.SMTP_URL,
      from: process.env.SMTP_FROM || 'noreply@nsds.example.com'
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/'
  }
})

export { handler as GET, handler as POST }
