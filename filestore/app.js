import express from 'express'
import cors from 'cors'
import { loadSettings } from './modules/util.js'
import {getFile, getFileList, storeFile, getLink}  from './modules/storageHandler.js'
const fileMimeType = 'application/octet-stream'
const listMimeType = 'application/json'
let settings

settings = loadSettings('./appSettings.json')
const app = express()
//app.use(express.json)
app.use(cors({
    origin: '*'
}));

app.use(express.raw({ limit: settings.requestLimit, type: fileMimeType }))

function sendResponse(responseObject, result) {
    if(typeof result === 'undefined' ) {
        responseObject.status(500).send('error')
        return
    }
    responseObject.send(result)
}

app.get('/files', async (req, res) => {
    res.type(listMimeType)
    const list = await getFileList() || []
    sendResponse(res, { list })
})

// app.get('/file/:fileName', async (req, res) => {
//     res.type(fileMimeType)
//     sendResponse(res, await getFile(req))
// })

app.post('/file', async (req, res) => {
    sendResponse(res, await storeFile(req))
})

app.get('/link/:fileName', (req, res) => {
    sendResponse(res, getLink(req, settings.accountName, settings.accountKey, settings.blobEndpoint, settings.containerName))
})

let server = app.listen(settings.port, () => {
console.log(`File storage app listening at http://localhost:${settings.port}`)
})

export default server 
