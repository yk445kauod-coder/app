import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "https://your-account-id.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "your-access-key",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "your-secret-key",
  },
});
