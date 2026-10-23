import express from "express"
import cors from "cors"
import helmet from "helmet"
import { StatusCodes } from "http-status-codes"
import { env } from "./config/env.js"
import { errorHandler } from "./shared/middlewares/error-handler.js"
import { NotFoundError } from "./shared/errors/custom-errors.js"
import { clienteRouter } from "./modules/cliente/cliente.router.js"

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json())

app.get("/health", (_req, res) => {
  res.status(StatusCodes.OK).json({ status: "ok" })
})

app.use("/api/clientes", clienteRouter)

app.use((_req, _res, next) => {
  next(new NotFoundError("Ruta no encontrada", "RUTA_NO_ENCONTRADA"))
})

app.use(errorHandler)



// $env:DATABASE_URL = "postgresql://postgres:123456@localhost:5432/facturacion_test?schema=public"
// npx prisma migrate deploy
// Remove-Item Env:DATABASE_URL