import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Sequelize } from "sequelize";
import databaseConfig from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelFiles = fs
  .readdirSync(path.join(__dirname, "../models"))
  .filter((file) => file.endsWith(".js"));

const sequelizeService = {
  init: async () => {
    try {
      const connection = new Sequelize(databaseConfig);

      // Initialize models
      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);
        model.default.init(connection);
      }

      // Setup associations if any
      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);
        if (model.default.associate) {
          model.default.associate(connection.models);
        }
      }

      console.log("[SEQUELIZE] Database service initialized");
    } catch (error) {
      console.error(
        "[SEQUELIZE] Error during database service initialization",
        error
      );
      throw error;
    }
  },
};

export default sequelizeService;
