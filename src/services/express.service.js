import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Sequelize } from "sequelize";
import databaseConfig from "../config/database.js"; // make sure this file uses ES modules syntax too!

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelFiles = fs
  .readdirSync(path.join(__dirname, "../models"))
  .filter((file) => file.endsWith(".js"));

const expressService = {
  init: async () => {
    try {
      const server = express();

      // Load routes dynamically and use each as middleware
      for (const file of routeFiles) {
        const routeModule = await import(`../routes/${file}`);
        // Assume each route module exports one router object
        const route = routeModule.default || Object.values(routeModule)[0];
        server.use(route);
      }

      server.use(bodyParser.json());
      server.use(globalErrorHandler);

      const port = process.env.SERVER_PORT || 3000;
      server.listen(port, () => {
        console.log(`[EXPRESS] Server listening on port ${port}`);
      });

      console.log("[EXPRESS] Express initialized");
    } catch (error) {
      console.error(
        "[EXPRESS] Error during express service initialization",
        error
      );
      throw error;
    }
  },
};

export default expressService;
