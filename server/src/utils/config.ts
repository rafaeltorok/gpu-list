import dotenv from "dotenv";
dotenv.config();

const PORT: string | undefined = process.env.PORT || "3001";

let MONGODB_URI: string | undefined;

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
} else if (process.env.NODE_ENV === "e2e") {
  MONGODB_URI = process.env.E2E_MONGODB_URI;
} else {
  MONGODB_URI = process.env.MONGODB_URI;
}

export default { PORT, MONGODB_URI };
