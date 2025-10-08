import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the certificate in the same folder
const ssl = {
  ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: { ssl },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database is connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

export default sequelize;
