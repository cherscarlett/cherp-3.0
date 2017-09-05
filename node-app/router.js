'use strict'

const data = require('./lib/data.json')
const Vue = require('vue')
const fs =  require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const cdn = require('./lib/cdn')
// const page = require('./pages/')

const serverBundle = require('../vue-ssr-server-bundle.json')
const clientManifest = require('../vue-ssr-client-manifest.json')
const template = fs.readFileSync('./vue-app/index.template.html', 'utf-8')

const getDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.lstatSync(path.join(srcPath, file)).isDirectory())

const pages = getDirectories('./vue-app/pages')

const renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false,
      template,
      clientManifest
})

module.exports = {
    page: async (request, response) => {

        const context = { url: request.url, cdn: cdn, pages: pages, theme: 'light' }

        renderer.renderToString(Object.assign(context, data), (err, html) => {
            if (err) {
                response.end(`${err.code}`)
                return
            }
            response.end(html)
        })

        // const page = request.originalUrl.replace('/', '')
        //let template = require('../ui/layouts/base')
        // response.setHeader('Content-Type', 'text/html; charset=utf-8')
        // let data = require('./lib/data.json')
        // data.cdn = require('./lib/cdn')
        // data.selected = page || 'home'
        // data.theme = 'forest'
        // data.app.abbreviateLogo = false
        // if (page) {
        //     template = require(`../ui/pages/${page}/`)
        //     data.app.abbreviateLogo = true
        //     data.app[page] = await pages[page].init()
        // }
        // setData(data)
        //template.render(data, response)
    },
    resolveData: (data = dataStore.data) => {
        console.log(`${Date.now()}: resolve data called`)
    }
}
