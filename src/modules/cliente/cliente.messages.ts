export const clienteMessages = {
  nombreCorto: {
    required: "El nombre corto es obligatorio",
    invalidType: "El nombre corto debe ser texto",
    empty: "El nombre corto no puede estar vacío",
    max: "El nombre corto no puede superar los 100 caracteres",
  },
  nombreLargo: {
    required: "El nombre largo es obligatorio",
    invalidType: "El nombre largo debe ser texto",
    empty: "El nombre largo no puede estar vacío",
    max: "El nombre largo no puede superar los 255 caracteres",
  },
  direccion: {
    required: "La dirección es obligatoria",
    invalidType: "La dirección debe ser texto",
    empty: "La dirección no puede estar vacía",
    max: "La dirección no puede superar los 255 caracteres",
  },
  codigoPostal: {
    required: "El código postal es obligatorio",
    invalidType: "El código postal debe ser texto",
    empty: "El código postal no puede estar vacío",
    max: "El código postal no puede superar los 10 caracteres",
  },
  nif: {
    required: "El NIF es obligatorio",
    invalidType: "El NIF debe ser texto",
    empty: "El NIF no puede estar vacío",
    max: "El NIF no puede superar los 25 caracteres",
  },
  email: {
    required: "El email es obligatorio",
    invalidType: "El email debe ser texto",
    invalid: "El email no tiene un formato válido",
    max: "El email no puede superar los 150 caracteres",
  },
  formaPago: { invalid: "La forma de pago no es válida" },
  empresa: { invalid: "La empresa asociada no es válida" },
  vencimiento: { invalid: "El vencimiento no es válido" },
  iva: {
    required: "El IVA es obligatorio",
    invalidType: "El IVA debe ser un número",
    min: "El IVA no puede ser negativo",
    max: "El IVA no puede superar el 100%",
  },
  precioDesplazamiento: {
    required: "El precio de desplazamiento es obligatorio",
    invalidType: "El precio de desplazamiento debe ser un número",
    int: "El precio de desplazamiento debe ser un número entero",
    min: "El precio de desplazamiento no puede ser negativo",
  },
  precioHoraManoObra: {
    required: "El precio de la hora de mano de obra es obligatorio",
    invalidType: "El precio de la hora de mano de obra debe ser un número",
    int: "El precio de la hora de mano de obra debe ser un número entero",
    min: "El precio de la hora de mano de obra no puede ser negativo",
  },
  motivoBaja: {
    required: "El motivo de baja es obligatorio",
    invalidType: "El motivo de baja debe ser texto",
    empty: "El motivo de baja no puede estar vacío",
    max: "El motivo de baja no puede superar los 255 caracteres",
  },
  id: {
    invalidType: "El id debe ser un número",
    int: "El id debe ser un número entero",
    positive: "El id debe ser mayor que 0",
  },
  general: {
    clienteRegistrado: "El cliente se ha registrado correctamente",
    clienteActualizado: "El cliente se ha actualizado correctamente",
    clienteDadoBaja: "El cliente se ha dado de baja correctamente",
    clienteDadoAlta: "El cliente se ha dado de alta correctamente",
    sinCambios: "Debes enviar al menos un campo a actualizar",
    camposNoPermitidos: (campos: string[]) =>
      `Campos no permitidos: ${campos.join(", ")}`,
  },

  // Errores de dominio (los usa cliente.errors.ts)
  errores: {
    noEncontrado: (id: number) => `Cliente con id ${id} no encontrado`,
    duplicado: (nombreCorto: string) => `Ya existe un cliente con nombre corto "${nombreCorto}"`,
    yaDadoDeBaja: (id: number) => `El cliente con id ${id} ya está dado de baja`,
  },
} as const