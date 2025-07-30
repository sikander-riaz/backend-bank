import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import globalErrorHandler from "../middlewares/errorHandler.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.join(__dirname, "../routes");
const routeFiles = fs
  .readdirSync(routesPath)
  .filter((file) => file.endsWith(".js"));

const expressService = {
  init: async () => {
    try {
      const server = express();

      for (const file of routeFiles) {
        const routeModule = await import(`../routes/${file}`);
        const route = routeModule.default || Object.values(routeModule)[0];
        server.use("/api", route);
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
