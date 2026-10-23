// tests/integration/global-setup.ts
import { execSync } from "node:child_process"
import { loadEnv } from "vite"

export default function setup() {
  const env = loadEnv("test", process.cwd(), "")
  const url = env.DATABASE_URL

  // Salvaguarda: estos tests borran datos, nunca deben tocar la BD real
  if (!url || !new URL(url).pathname.toLowerCase().includes("test")) {
    throw new Error(
      "DATABASE_URL no apunta a una BD de pruebas (el nombre debe contener 'test')",
    )
  }

  // Aplica las migraciones a la BD de pruebas
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, ...env },
  })
}