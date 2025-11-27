import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tomar todos los argumentos como nombre
const name = process.argv.slice(2).join(" ");
if (!name) {
  console.error("Usage: npm run migrate:new <migration_name>");
  process.exit(1);
}

// Reemplazar espacios por _
const cleanName = name.replace(/\s+/g, "_");

// Directorios de migraciones
const upDir = path.join(__dirname, "../migrations/up");
const downDir = path.join(__dirname, "../migrations/down");

// Crear directorios si no existen
if (!fs.existsSync(upDir)) fs.mkdirSync(upDir, { recursive: true });
if (!fs.existsSync(downDir)) fs.mkdirSync(downDir, { recursive: true });

// Obtener siguiente número de migración
function getNextMigrationNumber(dir: string) {
  const files = fs.readdirSync(dir)
    .map(f => parseInt(f.split("_")[0]))
    .filter(n => !isNaN(n));
  return files.length > 0 ? Math.max(...files) + 1 : 1;
}

const nextNumber = getNextMigrationNumber(upDir);
const numberStr = String(nextNumber).padStart(3, "0");

// Rutas finales de los archivos
const upFile = path.join(upDir, `${numberStr}_${cleanName}.sql`);
const downFile = path.join(downDir, `${numberStr}_${cleanName}.sql`);

// Crear archivos vacíos con comentario inicial
fs.writeFileSync(upFile, `-- ${name} (up)\n`);
fs.writeFileSync(downFile, `-- ${name} (down)\n`);

console.log("Created migration:");
console.log(`  ${upFile}`);
console.log(`  ${downFile}`);
