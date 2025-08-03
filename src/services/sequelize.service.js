import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Sequelize } from "sequelize";
import databaseConfig from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all model files from /models
const modelFiles = fs
  .readdirSync(path.join(__dirname, "../models"))
  .filter((file) => file.endsWith(".js"));

const sequelizeService = {
  init: async () => {
    try {
      const connection = new Sequelize(databaseConfig);
      const models = [];

      // Initialize all models
      for (const file of modelFiles) {
        const modelModule = await import(`../models/${file}`);
        const model = modelModule.default.init(connection);
        models.push(modelModule.default);
      }

      // Setup associations if defined
      for (const model of models) {
        if (typeof model.associate === "function") {
          model.associate(connection.models);
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
