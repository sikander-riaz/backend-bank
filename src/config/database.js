import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log(
  "DB_PASSWORD:",
  process.env.DB_PASSWORD,
  typeof process.env.DB_PASSWORD
);

export default {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "localhost",
  dialect: "postgres",
};
