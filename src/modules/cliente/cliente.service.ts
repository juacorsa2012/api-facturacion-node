import { Estado, Prisma, PrismaClient } from "../../../generated/prisma/client.js"
import { prisma } from "../../prisma.js"
import { PAGINATION } from "../../shared/constants/pagination.js"
import {
  ClienteDuplicadoError,
  ClienteNoEncontradoError,
  ClienteYaDadoDeAltaError,
  ClienteYaDadoDeBajaError,
} from "./cliente.errors.js"
import type {
  ActualizarClienteDto,
  CrearClienteDto,
  DarBajaClienteDto,
  ListarClientesDto,
  
} from "./cliente.schema.js"

export class ClienteService { 
 constructor(private readonly db: PrismaClient) {}

  async obtenerTodos({ estado, empresa, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT }: ListarClientesDto) {
    const where: Prisma.ClienteWhereInput = { estado, empresa }

    const [items, total] = await prisma.$transaction([
      prisma.cliente.findMany({
        where,
        orderBy: { nombreCorto: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.cliente.count({ where }),
    ])

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }  

  async obtenerPorId(id: number) {
    const cliente = await this.db.cliente.findUnique({ where: { id } })
    if (!cliente) throw new ClienteNoEncontradoError(id)
    return cliente
  }

  async crear(data: CrearClienteDto) {
    try {
      return await this.db.cliente.create({ data })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ClienteDuplicadoError(data.nombreCorto)
      }

      throw error
    }
  }

  async actualizar(id: number, data: ActualizarClienteDto) {
    try {
      return await this.db.cliente.update({
        where: { id },
        data,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ClienteNoEncontradoError(id)
        }

        if (error.code === "P2002" && data.nombreCorto !== undefined) {
          throw new ClienteDuplicadoError(data.nombreCorto)
        }
      }

      throw error
    }
  }

  async darBaja(id: number, data: DarBajaClienteDto) {
    const cliente = await this.obtenerPorId(id) 

    if (cliente.estado === Estado.BAJA) {
      throw new ClienteYaDadoDeBajaError(id)
    }

    return prisma.cliente.update({
      where: { id },
      data: {
        estado: Estado.BAJA,
        fechaBaja: new Date(),
        motivoBaja: data.motivoBaja,
      },
    })
  }

  async darAlta(id: number) {
    const cliente = await this.obtenerPorId(id) 

    if (cliente.estado === Estado.ALTA) {
      throw new ClienteYaDadoDeAltaError(id)
    }

    return this.db.cliente.update({
      where: { id },
      data: {
        estado: Estado.ALTA,
        fechaBaja: null,
        motivoBaja: null,
      },
    })
  }
}
