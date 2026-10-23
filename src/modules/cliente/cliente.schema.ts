import { z } from "zod"
import { FormaPago, Empresa, Vencimiento, Estado } from "../../../generated/prisma/client.js"
import { clienteMessages as m } from "./cliente.messages.js"
import { PAGINATION } from "../../shared/constants/pagination.js"

// Mensaje distinto si el campo falta o si llega con un tipo incorrecto
const tipo = (msg: { required: string; invalidType: string }) => ({
  error: (iss: { input?: unknown }) =>
    iss.input === undefined ? msg.required : msg.invalidType,
})

export const crearClienteSchema = z
  .object(
    {
      nombreCorto: z.string(tipo(m.nombreCorto)).trim()
        .min(1, m.nombreCorto.empty)
        .max(100, m.nombreCorto.max),

      nombreLargo: z.string(tipo(m.nombreLargo)).trim()
        .min(1, m.nombreLargo.empty)
        .max(255, m.nombreLargo.max),

      direccion: z.string(tipo(m.direccion)).trim()
        .min(1, m.direccion.empty)
        .max(255, m.direccion.max),

      codigoPostal: z.string(tipo(m.codigoPostal)).trim()
        .min(1, m.codigoPostal.empty)
        .max(10, m.codigoPostal.max),

      nif: z.string(tipo(m.nif)).trim()
        .min(1, m.nif.empty)
        .max(25, m.nif.max),

      email: z.string(tipo(m.email)).trim()
        .email(m.email.invalid)
        .max(150, m.email.max),

      formaPago: z.enum(FormaPago, { error: m.formaPago.invalid })
        .default(FormaPago.TRANSFERENCIA),

      empresa: z.enum(Empresa, { error: m.empresa.invalid })
        .default(Empresa.LEMS),

      vencimiento: z.enum(Vencimiento, { error: m.vencimiento.invalid })
        .default(Vencimiento.UN_MES),

      iva: z.number(tipo(m.iva))
        .min(0, m.iva.min)
        .max(100, m.iva.max)
        .default(21),

      precioDesplazamiento: z.number(tipo(m.precioDesplazamiento))
        .int(m.precioDesplazamiento.int)
        .min(0, m.precioDesplazamiento.min),

      precioHoraManoObra: z.number(tipo(m.precioHoraManoObra))
        .int(m.precioHoraManoObra.int)
        .min(0, m.precioHoraManoObra.min),
    },
    {
      error: (iss) =>
        iss.code === "unrecognized_keys"
          ? m.general.camposNoPermitidos(iss.keys)
          : undefined,
    },
  )
  .strict()

export const actualizarClienteSchema = crearClienteSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: m.general.sinCambios,
  })

export const darBajaClienteSchema = z
  .object({
    motivoBaja: z.string(tipo(m.motivoBaja)).trim()
      .min(1, m.motivoBaja.empty)
      .max(255, m.motivoBaja.max),
  })
  .strict()

export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: m.id.invalidType })
    .int(m.id.int)
    .positive(m.id.positive),
})

export const listarClientesSchema = z.object({
  estado: z.enum(Estado).optional(),
  empresa: z.enum(Empresa).optional(),
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
})

export type CrearClienteDto = z.infer<typeof crearClienteSchema>
export type ActualizarClienteDto = z.infer<typeof actualizarClienteSchema>
export type DarBajaClienteDto = z.infer<typeof darBajaClienteSchema>
export type ListarClientesDto = z.infer<typeof listarClientesSchema>