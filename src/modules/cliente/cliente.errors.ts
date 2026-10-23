import { NotFoundError, ConflictError } from "../../shared/errors/custom-errors.js"

export class ClienteNoEncontradoError extends NotFoundError {
  constructor(id: number) {
    super(`Cliente con id ${id} no encontrado`, "CLIENTE_NO_ENCONTRADO")
  }
}

export class ClienteDuplicadoError extends ConflictError {
  constructor(nombreCorto: string) {
    super(`Ya existe un cliente con nombre corto "${nombreCorto}"`, "CLIENTE_DUPLICADO")
  }
}

export class ClienteYaDadoDeBajaError extends ConflictError {
  constructor(id: number) {
    super(`El cliente con id ${id} ya está dado de baja`, "CLIENTE_YA_DADO_DE_BAJA")
  }
}

export class ClienteYaDadoDeAltaError extends ConflictError {
  constructor(id: number) {
    super(`El cliente con id ${id} ya está dado de alta`, "CLIENTE_YA_DADO_DE_ALTA")
  }
}

