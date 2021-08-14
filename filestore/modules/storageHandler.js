//import { DefaultAzureCredential } from "@azure/identity"
import { BlobServiceClient } from "@azure/storage-blob"

const containerName = 'files'
const connectionString = 'AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;'
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
const containerClient = blobServiceClient.getContainerClient(containerName)

export async function storeFile(request) {
  const blobName = "newblob" + new Date().getTime()
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  const uploadBlobResponse = await blockBlobClient.upload(request.body, request.body.length)
  return uploadBlobResponse._response
}

export function getFile() {
  return 'filecontent'
}

export async function getFileList() {
  let files = []
  let blobs = containerClient.listBlobsFlat();
  for await (const blob of blobs) {
    files.push(blob.name)
    console.log(blob.name)
  }
  return files
}