import dotenv from "dotenv";
dotenv.config();

const PORT: string | undefined = process.env.PORT || "3001";
const MONGODB_URI: string | undefined =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

export default { PORT, MONGODB_URI };
