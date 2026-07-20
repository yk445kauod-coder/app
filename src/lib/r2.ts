import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "https://your-account-id.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "your-access-key",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "your-secret-key",
  },
});

export const uploadToR2 = async (file: File, fileName: string) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || "products",
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  });

  try {
    await s3Client.send(command);
    return `${process.env.R2_PUBLIC_URL}/${fileName}`;
  } catch (err) {
    console.error("R2 Upload Error:", err);
    throw err;
  }
};
