//import { DefaultAzureCredential } from "@azure/identity"
// import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob"
import storage from "@azure/storage-blob"

const containerName = 'files'
const blobNamePrefix = 'blob_'
const connectionString = 'AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;'
let blobServiceClient
let containerClient

(async function(){
  blobServiceClient = storage.BlobServiceClient.fromConnectionString(connectionString)
  containerClient = blobServiceClient.getContainerClient(containerName)
  const iter = blobServiceClient.listContainers();
  let containerItem = await iter.next();
  if(containerItem.done) {
    await blobServiceClient.createContainer(containerName)
  }
})()

export async function storeFile(request) {
  const time = new Date().getTime().toString()
  const blobName = blobNamePrefix + time
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  let options = { metadata: { filename: request.headers.filename, time } } 
  const uploadBlobResponse = await blockBlobClient.upload(request.body, request.body.length, options)
  return uploadBlobResponse._response
}

export async function getFile(request) {
  const blobClient = containerClient.getBlobClient(request.params.fileName)
  const downloadBlockBlobResponse = await blobClient.download()
  return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
}

export function getLink(request, accountName, accountKey, blobStoragePath, containerName) {
  const cerds = new storage.StorageSharedKeyCredential(accountName,accountKey);
  const blobName = request.params.fileName

  const blobSAS = storage.generateBlobSASQueryParameters({
    containerName, 
    blobName, 
    permissions: storage.BlobSASPermissions.parse("racwd"), 
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 86400)
  }, cerds).toString()

  return blobStoragePath + '/' + containerName + '/' + blobName + "?" + blobSAS
  
  // const credential = new StorageSharedKeyCredential(accountName, accountKey)
  // const blobClient = new BlockBlobClient(blobStoragePath + '/' + containerName + '/' + request.params.fileName, credential)
  // return await blobClient.generateSasUrl()
}

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on("error", reject)
  })
}

export async function getFileList() {
  let files = []
  let blobs = containerClient.listBlobsFlat({ includeMetadata: true });
  for await (const blob of blobs) {
    files.push({ name: blob.name, fileName: blob.metadata.filename, time: blob.metadata.time })
    console.log(blob.name)
  }
  return files
}