import express from 'express'
import cors from 'cors'
import { loadSettings } from './modules/util.js'
import {getFile, getFileList, storeFile, getLink}  from './modules/storageHandler.js'
const fileMimeType = 'application/octet-stream'
const listMimeType = 'application/json'
let settings

(async function() {
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
        // res.send({ list: await getFileList() })
    })

    app.get('/file/:fileName', async (req, res) => {
        res.type(fileMimeType)
        sendResponse(res, await getFile(req))
        // res.send(await getFile(req))
    })

    app.post('/file', async (req, res) => {
        sendResponse(res, await storeFile(req))
        // res.send(storeFile(req))
    })

    app.get('/link/:fileName', (req, res) => {
        sendResponse(res, getLink(req, settings.accountName, settings.accountKey, settings.blobEndpoint, settings.containerName))
        // res.send(getLink(req, settings.accountName, settings.accountKey, settings.blobEndpoint, settings.containerName))
    })

    app.listen(settings.port, () => {
    console.log(`File storage app listening at http://localhost:${settings.port}`)
    })
})()