import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "@/lib/env";

const s3 = new S3Client({
  region: env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

export async function getSignedS3Url(fileName: string, fileType: string) {
  const key = `uploads/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: env.NEXT_AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return {
    url: signedUrl,
    key,
    publicUrl: `${env.NEXT_PUBLIC_AWS_CDN_URL}/${key}`,
  };
}
