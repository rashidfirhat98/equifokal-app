import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  PEXELS_API_KEY: str(),
  NEXTAUTH_SECRET: str(),
});

export default env;
