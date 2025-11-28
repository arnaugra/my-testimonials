import 'dotenv/config'
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { db } from "../db.js"

const migrationsDir = path.join(process.cwd(), "migrations/down");
const files = fs.readdirSync(migrationsDir).sort().reverse();

(async () => {
  const [rows]: any = await db.execute("SELECT MAX(batch) as lastBatch FROM migrations");
  const lastBatch = rows[0].lastBatch;
  if (!lastBatch) {
    console.log("No migrations to rollback.");
    process.exit(0);
  }

  const [migrations]: any = await db.execute("SELECT name FROM migrations WHERE batch = ?", [lastBatch]);

  for (const { name } of migrations) {
    const filePath = path.join(migrationsDir, name);
    if (!fs.existsSync(filePath)) continue;

    const sql = fs.readFileSync(filePath, "utf8").replace(/\r/g, "");
    console.log(`Rolling back migration: ${name}`);
    await db.query(sql);

    await db.execute("DELETE FROM migrations WHERE name = ?", [name]);
  }

  console.log("✅ All migrations reverted");
  process.exit(0);
})();
