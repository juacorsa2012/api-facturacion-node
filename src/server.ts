import { app } from "./app.js"
import { env } from "./config/env.js"
import { logger } from "./config/logger.js"
import { prisma } from "./prisma.js"

const server = app.listen(env.PORT, () => {  
  logger.info(`API escuchando en http://localhost:${env.PORT}`)
})

const shutdown = async () => {
  logger.error("Cerrando servidor...")
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)