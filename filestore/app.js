import express from 'express'
import {getFile, getFileList, storeFile}  from './modules/storageHandler.js'
const fileMimeType = 'application/octet-stream'
const listMimeType = 'application/json'
const app = express()
//app.use(express.json)
app.use(express.raw({limit: '3mb', type: fileMimeType}))
const port = 3000

app.get('/files', async (req, res) => {
    res.type(listMimeType)
    res.send({ list: await getFileList() })
})

app.get('/file', (req, res) => {
    res.type(fileMimeType)
    res.send(getFile())
})

app.post('/file', (req, res) => {
    res.send(storeFile(req))
})

app.listen(port, () => {
  console.log(`File storage app listening at http://localhost:${port}`)
})