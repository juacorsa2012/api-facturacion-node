import { StatusCodes } from "http-status-codes"

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    public readonly code: string = "INTERNAL_ERROR",
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

// Errores genéricos reutilizables por todos los módulos
export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado", code = "NOT_FOUND") {
    super(message, StatusCodes.NOT_FOUND, code)
  }
}

export class ConflictError extends AppError {
  constructor(message = "El recurso ya existe", code = "CONFLICT") {
    super(message, StatusCodes.CONFLICT, code)
  }
}

export class ValidationError extends AppError {
  constructor(message = "Datos no válidos", details?: unknown) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", details)
  }
}


