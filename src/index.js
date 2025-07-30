import dotenv from "dotenv";
import expressService from "../src/services/express.service.js";
import sequelizeService from "../src/services/sequelize.service.js";

// import awsService from "./services/aws.service";

dotenv.config();

const services = [expressService, sequelizeService];

(async () => {
  try {
    for (const service of services) {
      await service.init();
    }
    console.log("Server initialized.");
    // PUT ADDITIONAL CODE HERE.
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
