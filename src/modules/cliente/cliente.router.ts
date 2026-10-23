
import { Router } from "express"
import { ClienteService } from "./cliente.service.js"
import { ClienteController } from "./cliente.controller.js"
import { prisma } from "../../prisma.js"

const clienteService = new ClienteService(prisma)
const clienteController = new ClienteController(clienteService)

export const clienteRouter = Router()

clienteRouter.get("/", clienteController.obtenerTodos)

clienteRouter.get("/:id", clienteController.obtenerPorId)

clienteRouter.post("/", clienteController.crear)

clienteRouter.put("/:id", clienteController.actualizar)

clienteRouter.patch("/:id/baja", clienteController.darBaja)

clienteRouter.patch("/:id/alta", clienteController.darAlta)

