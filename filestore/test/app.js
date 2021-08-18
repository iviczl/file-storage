import server from '../app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import fs from 'fs'

chai.should()
chai.use(chaiHttp)

describe('all endpoints', () => {
    describe('tests files GET', () => {
        it('should return info for all files', (done) => {
            chai.request(server)
                .get('/files')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('list')
                    res.body.list.should.be.a('array')
                    done()
                })
                
        })
    }),
    describe('tests file link GET', () => {
        it('should return a shareable link', (done) => {
            chai.request(server)
                .get('/link/blob_1629028026036') // should mock this value
                .set('Accept', 'text/plain')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.text.should.include('sv=')
                    res.text.should.include('st=')
                    res.text.should.include('se=')
                    res.text.should.include('sr=')
                    res.text.should.include('sp=')
                    res.text.should.include('sig=')
                done()
                })
        })
    }),
    describe('tests file POST', () => {
        it('should store a file', (done) => {
            // const data = fs.readFileSync('./appSettings.json')//, {encoding:'utf8', flag:'r'})
            chai.request(server)
            .post('/file') // should mock this value
            .set('Content-Type', 'application/octet-stream')
            .set('Content-Length', 677)//data.length.toString()
            .set('filename', 'appSettings.json')
            .attach('file', './appSettings.json', 'appSettings.json')
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.be.a('object')
                res.body.should.include('status')
                done()
            })
        })
    })
})
