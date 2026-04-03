// Server dependencies
import app from "./app.js";
import connectToDatabase from "./db/mongo.js";

// Middleware
import config from "./utils/config.js";
import logger from "./utils/logger.js";

try {
  await connectToDatabase();
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
} catch (err: unknown) {
  if (err instanceof Error) {
    logger.error(err.message);
  } else {
    logger.error(String(err));
  }
  process.exit(1);
}
