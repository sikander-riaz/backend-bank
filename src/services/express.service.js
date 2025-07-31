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

      server.use(bodyParser.json());
      server.use(bodyParser.urlencoded({ extended: true }));

      for (const file of routeFiles) {
        console.log(`[EXPRESS] Loading route file: ${file}`);

        const routeModule = await import(`../routes/${file}`);
        const route = routeModule.default || Object.values(routeModule)[0];

        // ✅ Check if router has any routes
        if (!route.stack || route.stack.length === 0) {
          console.warn(`[WARNING] ${file} contains NO routes`);
        } else {
          console.log(`[OK] ${file} contains ${route.stack.length} routes`);
          route.stack.forEach((layer) => {
            if (layer.route) {
              console.log(
                ` ↳ Route: [${Object.keys(layer.route.methods)
                  .join(", ")
                  .toUpperCase()}] /api${layer.route.path}`
              );
            }
          });
        }

        server.use("/api", route);
      }

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
