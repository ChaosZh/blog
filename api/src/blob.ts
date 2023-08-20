import { ContainerClient } from "@azure/storage-blob";

const containerUrl = "https://chaoszhblob.blob.core.windows.net/blog"
const containerClient = new ContainerClient(
  process.env.AZURE_BLOB_CONNECTION_STRING!,
  "blog"
);

export function CreateCopyToBlobTask(blob: string, sourceUrl: string): [string, Promise<any>] {
  console.log(`[CopyToBlob ${blob}] Start copy ${sourceUrl}`);
  let blobClient = containerClient.getBlobClient(blob);
  let task = blobClient.beginCopyFromURL(sourceUrl);
  return [`${containerUrl}/${blob}`, new Promise((resolve, reject) => {
    task.then((res) => {
      console.log(`[CopyToBlob ${blob}] Succeed to copy`);
      resolve(res);
    }).catch((err) => {
      console.log(`[CopyToBlob ${blob}]: Failed to copy, err: ${err}`);
      reject(err);
    });
  })];
}
