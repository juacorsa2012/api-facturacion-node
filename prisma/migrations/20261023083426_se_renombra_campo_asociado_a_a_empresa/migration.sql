/*
  Warnings:

  - You are about to drop the column `asociado_a` on the `clientes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clientes" DROP COLUMN "asociado_a",
ADD COLUMN     "empresa" "empresa" NOT NULL DEFAULT 'LEMS';

-- CreateIndex
CREATE INDEX "clientes_estado_idx" ON "clientes"("estado");

-- CreateIndex
CREATE INDEX "clientes_empresa_idx" ON "clientes"("empresa");
