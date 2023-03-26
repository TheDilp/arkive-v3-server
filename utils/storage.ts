import { s3Client } from "../client";

export async function emptyS3Directory(dir: string) {
  const listParams = {
    Bucket: process.env.DO_SPACES_NAME,
    Prefix: dir,
  };

  const listedObjects = await s3Client.listObjectsV2(listParams);

  if (
    !listedObjects?.Contents ||
    (listedObjects?.Contents && listedObjects.Contents.length === 0)
  )
    return;

  const deleteParams: {
    Bucket: string;
    Delete: { Objects: { Key: string }[] };
  } = {
    Bucket: process.env.DO_SPACES_NAME as string,
    Delete: { Objects: [] },
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key: Key as string });
  });

  await s3Client.deleteObjects(deleteParams);

  if (listedObjects.IsTruncated) await emptyS3Directory(dir);
}
