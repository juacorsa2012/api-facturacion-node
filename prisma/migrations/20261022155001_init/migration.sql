/*
  Warnings:

  - The values [DIS_MESES] on the enum `vencimiento` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "vencimiento_new" AS ENUM ('UN_MES', 'DOS_MESES', 'VEINTE_DIAS', 'QUINCE_DIAS');
ALTER TABLE "public"."clientes" ALTER COLUMN "vencimiento" DROP DEFAULT;
ALTER TABLE "clientes" ALTER COLUMN "vencimiento" TYPE "vencimiento_new" USING ("vencimiento"::text::"vencimiento_new");
ALTER TYPE "vencimiento" RENAME TO "vencimiento_old";
ALTER TYPE "vencimiento_new" RENAME TO "vencimiento";
DROP TYPE "public"."vencimiento_old";
ALTER TABLE "clientes" ALTER COLUMN "vencimiento" SET DEFAULT 'UN_MES';
COMMIT;
