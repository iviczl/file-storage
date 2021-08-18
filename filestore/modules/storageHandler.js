//import { DefaultAzureCredential } from "@azure/identity"
// import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob"
import storage from "@azure/storage-blob"

export let isInitialized = false
const containerName = 'files'
const blobNamePrefix = 'blob_'
const connectionString = 'AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;'
let blobServiceClient
let containerClient

// (async function(){
//   await init()
// })()

async function init() {
  try {
    blobServiceClient = storage.BlobServiceClient.fromConnectionString(connectionString)
    containerClient = blobServiceClient.getContainerClient(containerName)
    const iter = blobServiceClient.listContainers();
    let containerItem = await iter.next();
    if(containerItem.done) {
      await blobServiceClient.createContainer(containerName)
    }
    isInitialized = true
  } catch (error) {
    console.error(error)
  } finally {
    return isInitialized
  }
}

async function assertInitialized() {
  if(!isInitialized) {
    if(! await init()) {
      console.error('cannot be initialized')
      return false
    }
  }
  return true
}

export async function storeFile(request) {
  if(! await assertInitialized()) { return }
  const time = new Date().getTime().toString()
  const blobName = blobNamePrefix + time
  let response
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    let options = { metadata: { filename: request.headers.filename, time } } 
    const uploadBlobResponse = await blockBlobClient.upload(request.body, request.body.length, options)
    response = uploadBlobResponse._response.status == 201 ? { status: uploadBlobResponse._response.status } : undefined
  } catch (error) {
    console.error(error)
  }
  return response
}

export async function getFile(request) {
  if(! await assertInitialized()) { return }
  let response
  try {
    const blobClient = containerClient.getBlobClient(request.params.fileName)
    const downloadBlockBlobResponse = await blobClient.download()
    return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
  } catch (error) {
    console.error(error)
  }
  return response
}

export function getLink(request, accountName, accountKey, blobStoragePath, containerName) {
  // if(assertInitialized().then((r) => !r)) { return }
  let response
  try {
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
  } catch (error) {
    console.error(error)
  }
  return response
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
  if(! await assertInitialized()) { return }
  let files = []
  let response
  try {
    let blobs = containerClient.listBlobsFlat({ includeMetadata: true });
    for await (const blob of blobs) {
      files.push({ name: blob.name, fileName: blob.metadata.filename, time: blob.metadata.time })
      console.log(blob.name)
    }
    return files
  } catch (error) {
    console.error(error)
  }
  return response
}