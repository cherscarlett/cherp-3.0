'use strict'

const http = require('http')
const connect = require('connect')
const compression = require('compression')
const router = require('./router')
const dotenv = require('dotenv')

dotenv.load()

const port = process.env.PORT || '9001' // It's over 9000

const app = connect()
const server = http.createServer(app)

app
    .use(compression())
    .use('/', (request, response) => router.page(request, response))


server.listen(port, (err) => {
    if (err) {
        return console.error(`There was an error: ${err}`)
    }
    console.log(`Listening on port: ${port}`)
})

module.exports = app
