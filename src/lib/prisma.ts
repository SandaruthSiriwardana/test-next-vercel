import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Delay creating the client until runtime and ensure it's only created in handler execution.
let client: PrismaClient | undefined = globalThis.prisma
if (!client) {
  client = new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalThis.prisma = client
}

export const prisma = client
