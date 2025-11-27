import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    // Conectamos al servidor MySQL (sin seleccionar DB aún)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_ROOT_USER || "root",
      password: process.env.DB_ROOT_PASSWORD || "root_password",
    });

    const dbName = process.env.DB_NAME || "testimonials";
    const dbUser = process.env.DB_USER || "user";
    const dbPass = process.env.DB_PASSWORD || "user_password";

    // Creamos la base de datos
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database "${dbName}" created or already exists.`);

    // Creamos el usuario y le damos permisos
    await connection.query(`CREATE USER IF NOT EXISTS '${dbUser}'@'%' IDENTIFIED BY '${dbPass}';`);
    await connection.query(`GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO '${dbUser}'@'%';`);
    await connection.query(`FLUSH PRIVILEGES;`);

    console.log(`✅ User "${dbUser}" created and granted privileges on "${dbName}"`);

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating database or user:", err);
    process.exit(1);
  }
})();
