import request from "supertest"
import { describe, it, expect, beforeEach, afterAll } from "vitest"
import { StatusCodes } from "http-status-codes"
import { app } from "../../app.js"
import { prisma } from "../../prisma.js"
import { Empresa, Estado, FormaPago, type Prisma} from "../../../generated/prisma/client.js"
import { globalMessages as gm } from "../../shared/utils/messages.js"
import { clienteMessages as cm } from "./cliente.messages.js"

const BASE = "/api/clientes"
const ID_INEXISTENTE = 999999

const datosCliente = (overrides: Partial<Prisma.ClienteUncheckedCreateInput> = {}): Prisma.ClienteUncheckedCreateInput => ({
  nombreCorto: "A",
  nombreLargo: "CLIENTE A S.L.",
  direccion: "Calle Mayor 1",
  codigoPostal: "46001",
  nif: "B12345678",
  email: "cliente@example.com",
  formaPago: FormaPago.TRANSFERENCIA,
  empresa: Empresa.LEMS,
  precioDesplazamiento: 25,
  precioHoraManoObra: 55,
  ...overrides,
})

// Crea directamente en BD (más rápido y no depende del endpoint POST)
const crear_cliente_bd = (overrides: Partial<Prisma.ClienteUncheckedCreateInput> = {}) =>
  prisma.cliente.create({ data: datosCliente(overrides) })


describe("API de clientes (integración)", () => {
  beforeEach(async () => {
    await prisma.cliente.deleteMany()
  })

  afterAll(async () => {
    await prisma.cliente.deleteMany()
    await prisma.$disconnect()
  })

  describe(`GET ${BASE}`, () => {
    it("devuelve lista vacía", async () => {
      const res = await request(app).get(BASE)

      expect(res.status).toBe(StatusCodes.OK)
      expect(res.body.data.items).toEqual([])
      expect(res.body.data.meta.total).toBe(0)
    })

    it("filtra por estado", async () => {
      await crear_cliente_bd({ nombreCorto: "A", estado: Estado.ALTA })
      await crear_cliente_bd({ nombreCorto: "B", estado: Estado.BAJA, nif: "B22222222" })

      const res = await request(app).get(BASE).query({ estado: Estado.BAJA })

      expect(res.status).toBe(StatusCodes.OK)
      expect(res.body.data.items).toHaveLength(1)
      expect(res.body.data.items[0].nombreCorto).toBe("B")
    })

    it("filtra por emresa", async () => {
      await crear_cliente_bd({ nombreCorto: "A", empresa: Empresa.GTRES })
      await crear_cliente_bd({ nombreCorto: "B", empresa: Empresa.LEMS })

      const res = await request(app).get(BASE).query({ empresa: Empresa.LEMS })

      expect(res.status).toBe(StatusCodes.OK)
      expect(res.body.data.items).toHaveLength(1)
      expect(res.body.data.items[0].nombreCorto).toBe("B")
    })

    it("ordena por nombreCorto y pagina", async () => {
       await crear_cliente_bd({ nombreCorto: "A", nif: "B10000000" })
       await crear_cliente_bd({ nombreCorto: "B", nif: "B20000000" })
       await crear_cliente_bd({ nombreCorto: "C", nif: "B30000000" })

      const res = await request(app).get(BASE).query({ page: 1, limit: 2 })

      expect(res.status).toBe(StatusCodes.OK)
      expect(res.body.data.items.map((c: { nombreCorto: string }) => c.nombreCorto)).toEqual(["A", "B"])
      expect(res.body.data.meta).toMatchObject({
        total: 3,
        page: 1,
        limit: 2,
        totalPages: 2,
      })
    })
  }) // describe(`GET ${BASE}`, () =>


  describe(`GET ${BASE}/:id`, () => {
    it("devuelve el cliente", async () => {
      const cliente = await crear_cliente_bd()

      const res = await request(app).get(`${BASE}/${cliente.id}`)

      expect(res.status).toBe(StatusCodes.OK)
      expect(res.body.data.nombreCorto).toBe("A")      
    })

   it("devuelve 404 si no existe", async () => {
      const res = await request(app).get(`${BASE}/${ID_INEXISTENTE}`)

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(res.body.error.code).toBe("CLIENTE_NO_ENCONTRADO")      
      expect(res.body.error.message).toBe(`Cliente con id ${ID_INEXISTENTE} no encontrado`)      
    })

    it("devuelve 400 si el id no es numérico", async () => {
      const res = await request(app).get(`${BASE}/abc`)

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(res.body.message).toBe(gm.errorValidacion)
      expect(res.body.success).toBe(false)      
      expect(res.body.errors[0]["message"]).toBe(cm.id.invalidType)
    })
  }) // describe(`GET ${BASE}/:id`, () => 


  describe(`POST ${BASE}`, () => {
    it("crea el cliente", async () => {
      const res = await request(app).post(BASE).send(datosCliente())
      
      expect(res.status).toBe(StatusCodes.CREATED)
      expect(res.body.data.id).toBeDefined()
      
      const cliente = await prisma.cliente.findUnique({
        where: { id: res.body.data.id },
      })

      expect(cliente?.nombreCorto).toBe("A")
    })
  
    it("devuelve 409 si nombreCorto ya existe", async () => {
      await crear_cliente_bd()

      const res = await request(app).post(BASE).send(datosCliente({ nif: "B99999999" }))

      expect(res.status).toBe(StatusCodes.CONFLICT)
      expect(await prisma.cliente.count()).toBe(1)
    })

    it("devuelve 400 con body inválido - nombreCorto vacío", async () => {
      const res = await request(app).post(BASE).send({ nombreCorto: "" })

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(await prisma.cliente.count()).toBe(0)
    })    
  
    it("devuelve 400 con body inválido - nombreLargo vacío", async () => {
      const res = await request(app).post(BASE).send({ nombreLargo: "" })

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(await prisma.cliente.count()).toBe(0)
    })    

    // TODO falta testear los otros campos requeridos .... 
  
  }) // describe(`POST ${BASE}`, () => 


  describe(`PUT ${BASE}/:id`, () => {
    it("actualiza los campos enviados", async () => {
      const cliente = await crear_cliente_bd()

      const res = await request(app).put(`${BASE}/${cliente.id}`).send({ email: "nuevo@example.com" })

      expect(res.status).toBe(StatusCodes.OK)
      expect(res.body.data.email).toBe("nuevo@example.com")
      expect(res.body.data.nombreCorto).toBe("A") 
    })

    it("al actualizar devuelve 404 si no existe", async () => {
      const res = await request(app).put(`${BASE}/${ID_INEXISTENTE}`).send({ email: "x@example.com" })
    
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })    

    it("devuelve 409 si el nuevo nombreCorto ya existe", async () => {
      await crear_cliente_bd({ nombreCorto: "A" })
      const b = await crear_cliente_bd({ nombreCorto: "B", nif: "B22222222" })

      const res = await request(app).put(`${BASE}/${b.id}`).send({ nombreCorto: "A" })
      expect(res.status).toBe(StatusCodes.CONFLICT)
    })    
  }) // describe(`PATCH ${BASE}/:id`, () =>


  describe(`PATCH ${BASE}/:id/baja`, () => {
    it("da de baja con fecha y motivo", async () => {
      const cliente = await crear_cliente_bd()

      const res = await request(app).patch(`${BASE}/${cliente.id}/baja`).send({ motivoBaja: "Impago" })

      expect(res.status).toBe(StatusCodes.OK)

      const enBd = await prisma.cliente.findUnique({ where: { id: cliente.id } })

      expect(enBd?.estado).toBe(Estado.BAJA)
      expect(enBd?.motivoBaja).toBe("Impago")
      expect(enBd?.fechaBaja).toBeInstanceOf(Date)
    })
  
    it("devuelve 409 si ya está de baja", async () => {
      const cliente = await crear_cliente_bd({
        estado: Estado.BAJA,
        fechaBaja: new Date(),
        motivoBaja: "Antiguo",
      })

      const res = await request(app).patch(`${BASE}/${cliente.id}/baja`).send({ motivoBaja: "Otro" })

      expect(res.status).toBe(StatusCodes.CONFLICT)

      const enBd = await prisma.cliente.findUnique({ where: { id: cliente.id } })

      expect(enBd?.motivoBaja).toBe("Antiguo") 
    })

    it("devuelve 404 si no existe", async () => {
      const res = await request(app).patch(`${BASE}/${ID_INEXISTENTE}/baja`).send({ motivoBaja: "Impago" })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("devuelve 400 si falta el motivo", async () => {
      const cliente = await crear_cliente_bd()

      const res = await request(app).patch(`${BASE}/${cliente.id}/baja`).send({})

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    })  
  }) // describe(`PATCH ${BASE}/:id/baja`, () =>


  describe(`PATCH ${BASE}/:id/alta`, () => {
    it("reactiva y limpia fechaBaja y motivoBaja", async () => {
      const cliente = await crear_cliente_bd({
        estado: Estado.BAJA,
        fechaBaja: new Date(),
        motivoBaja: "Impago",
      })

      const res = await request(app).patch(`${BASE}/${cliente.id}/alta`)

      expect(res.status).toBe(StatusCodes.OK)

      const enBd = await prisma.cliente.findUnique({ where: { id: cliente.id } })
      expect(enBd?.estado).toBe(Estado.ALTA)
      expect(enBd?.fechaBaja).toBeNull()
      expect(enBd?.motivoBaja).toBeNull()
    })

    it("devuelve 409 si ya está de alta", async () => {
      const cliente = await crear_cliente_bd()

      const res = await request(app).patch(`${BASE}/${cliente.id}/alta`)

      expect(res.status).toBe(StatusCodes.CONFLICT)
    })

    it("devuelve 404 si no existe", async () => {
      const res = await request(app).patch(`${BASE}/${ID_INEXISTENTE}/alta`)

      expect(res.status).toBe(StatusCodes.NOT_FOUND)   
    })
  }) // describe(`PATCH ${BASE}/:id/alta`, () =>







}) // describe("API de clientes (integración)", () =>