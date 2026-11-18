import dotenv from "dotenv";
dotenv.config();

const PORT: string | undefined = process.env.PORT || "3001";

let MONGODB_URI: string | undefined;

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
} else if (process.env.NODE_ENV === "main-e2e") {
  MONGODB_URI = process.env.MAIN_E2E_MONGODB_URI;
} else if (process.env.NODE_ENV === "alt-e2e") {
  MONGODB_URI = process.env.ALT_E2E_MONGODB_URI;
} else {
  MONGODB_URI = process.env.MONGODB_URI;
}

export default { PORT, MONGODB_URI };
