import 'dotenv/config'
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { db } from "../db.js"

const migrationsDir = path.join(process.cwd(), "migrations/up");
const files = fs.readdirSync(migrationsDir).sort();

(async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      batch INT NOT NULL,
      applied_at DATETIME NOT NULL
    )
  `);

  const [rows]: any = await db.execute("SELECT MAX(batch) as lastBatch FROM migrations");
  const lastBatch = rows[0].lastBatch || 0;
  const nextBatch = lastBatch + 1;
  
  for (const file of files) {

    const [rows] = await db.execute("SELECT 1 FROM migrations WHERE name = ?", [file]);
    if ((rows as any[]).length) {
      console.log(`Skipping already applied migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Applying migration: ${file}`);
    
    await db.query(sql);

    await db.execute("INSERT INTO migrations (name, batch, applied_at) VALUES (?, ?, NOW())", [file, nextBatch]);
  }

  console.log("✅ All migrations applied");
  process.exit(0);
})();
