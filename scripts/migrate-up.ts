import 'dotenv/config'
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

const migrationsDir = path.join(process.cwd(), "migrations/up");
const files = fs.readdirSync(migrationsDir).sort();

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

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      batch INT NOT NULL,
      applied_at DATETIME NOT NULL
    )
  `);

  const [rows]: any = await connection.execute("SELECT MAX(batch) as lastBatch FROM migrations");
  const lastBatch = rows[0].lastBatch || 0;
  const nextBatch = lastBatch + 1;
  
  for (const file of files) {

    const [rows] = await connection.execute("SELECT 1 FROM migrations WHERE name = ?", [file]);
    if ((rows as any[]).length) {
      console.log(`Skipping already applied migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Applying migration: ${file}`);
    
    await connection.query(sql);

    await connection.execute("INSERT INTO migrations (name, batch, applied_at) VALUES (?, ?, NOW())", [file, nextBatch]);
  }

  console.log("✅ All migrations applied");
  process.exit(0);
})();
