import 'dotenv/config'
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

const migrationsDir = path.join(process.cwd(), "migrations/down");
const files = fs.readdirSync(migrationsDir).sort().reverse();

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "user_password",
    database: process.env.DB_NAME || "testimonials",
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
  });

  const [rows]: any = await connection.execute("SELECT MAX(batch) as lastBatch FROM migrations");
  const lastBatch = rows[0].lastBatch;
  if (!lastBatch) {
    console.log("No migrations to rollback.");
    process.exit(0);
  }

  const [migrations]: any = await connection.execute("SELECT name FROM migrations WHERE batch = ?", [lastBatch]);

  for (const { name } of migrations) {
    const filePath = path.join(migrationsDir, name);
    if (!fs.existsSync(filePath)) continue;

    const sql = fs.readFileSync(filePath, "utf8").replace(/\r/g, "");
    console.log(`Rolling back migration: ${name}`);
    await connection.query(sql);

    await connection.execute("DELETE FROM migrations WHERE name = ?", [name]);
  }

  console.log("✅ All migrations reverted");
  process.exit(0);
})();
