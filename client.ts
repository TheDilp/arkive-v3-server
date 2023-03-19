import { S3 } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY as string,
    secretAccessKey: process.env.DO_SPACES_SECRET as string,
  },
});

export default prisma;
