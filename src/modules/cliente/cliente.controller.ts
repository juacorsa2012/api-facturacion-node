import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import type { ClienteService } from "./cliente.service.js"
import { sendResponse } from "../../shared/utils/response.js"
import { clienteMessages as m } from "./cliente.messages.js"
import { logger } from "../../config/logger.js"
import {
  actualizarClienteSchema,
  crearClienteSchema,
  darBajaClienteSchema,
  idParamSchema,
  listarClientesSchema,
} from "./cliente.schema.js"

export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  obtenerTodos = async (req: Request, res: Response) => {
    const filtros = listarClientesSchema.parse(req.query)
    const resultado = await this.clienteService.obtenerTodos(filtros)

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      data: resultado,
    })
  }


  obtenerPorId = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const cliente = await this.clienteService.obtenerPorId(id)

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      data: cliente,
    })
  }

  crear = async (req: Request, res: Response) => {
    const data = crearClienteSchema.parse(req.body)
    const cliente = await this.clienteService.crear(data)

    logger.info(m.general.clienteRegistrado)

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      data: cliente,
      message: m.general.clienteRegistrado,
    })
  }

  actualizar = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const data = actualizarClienteSchema.parse(req.body)
    const cliente = await this.clienteService.actualizar(id, data)

    logger.info(m.general.clienteActualizado)

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      data: cliente,
      message: m.general.clienteActualizado,
    })
  }

  darBaja = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const data = darBajaClienteSchema.parse(req.body)
    const cliente = await this.clienteService.darBaja(id, data)

    logger.info(m.general.clienteDadoBaja)
    
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      data: cliente,
      message: m.general.clienteDadoBaja
    })
  }

  darAlta = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const cliente = await this.clienteService.darAlta(id)

    logger.info(m.general.clienteDadoAlta)
    
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      data: cliente,
      message: m.general.clienteDadoAlta
    })
  }





}
