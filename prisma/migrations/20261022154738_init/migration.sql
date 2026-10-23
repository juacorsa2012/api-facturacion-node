-- CreateEnum
CREATE TYPE "estado" AS ENUM ('ALTA', 'BAJA');

-- CreateEnum
CREATE TYPE "forma_pago" AS ENUM ('TRANSFERENCIA', 'RECIBO');

-- CreateEnum
CREATE TYPE "empresa" AS ENUM ('LEMS', 'GTRES');

-- CreateEnum
CREATE TYPE "vencimiento" AS ENUM ('UN_MES', 'DIS_MESES', 'VEINTE_DIAS', 'QUINCE_DIAS');

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nombre_corto" VARCHAR(100) NOT NULL,
    "nombre_largo" VARCHAR(255) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "codigo_postal" VARCHAR(10) NOT NULL,
    "nif" VARCHAR(25) NOT NULL,
    "forma_pago" "forma_pago" NOT NULL DEFAULT 'TRANSFERENCIA',
    "email" VARCHAR(150) NOT NULL,
    "asociado_a" "empresa" NOT NULL DEFAULT 'LEMS',
    "iva" DECIMAL(5,2) NOT NULL DEFAULT 21.0,
    "precio_desplazamiento" INTEGER NOT NULL,
    "pecio_hora_mano_obra" INTEGER NOT NULL,
    "fecha_baja" TIMESTAMP(3),
    "motivo_baja" VARCHAR(255),
    "vencimiento" "vencimiento" NOT NULL DEFAULT 'UN_MES',
    "estado" "estado" NOT NULL DEFAULT 'ALTA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_nombre_corto_key" ON "clientes"("nombre_corto");
