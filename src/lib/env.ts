import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  PEXELS_API_KEY: str(),
  NEXTAUTH_SECRET: str(),
  NEXT_AWS_S3_REGION: str(),
  NEXT_AWS_S3_ACCESS_KEY_ID: str(),
  NEXT_AWS_S3_SECRET_ACCESS_KEY: str(),
  NEXT_AWS_S3_BUCKET_NAME: str(),
});

export default env;
