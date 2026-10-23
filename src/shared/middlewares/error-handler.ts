// shared/middlewares/error-handler.ts
import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../errors/custom-errors.js"
import { logger } from "../../config/logger.js"
import { globalMessages as m } from "../utils/messages.js"

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(
      { code: err.code, statusCode: err.statusCode },
      err.message,
    )

    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    })
  }

   // Zod errors
  if (err instanceof ZodError) {
    logger.warn(m.errorValidacion)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: m.errorValidacion,
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }
   
  
  // Error inesperado: se registra y no se filtra información interna
  logger.error({ err }, m.errorInternoServidor)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: { code: "INTERNAL_ERROR", message: m.errorInternoServidor },
  })
}