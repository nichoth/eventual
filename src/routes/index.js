var Router = require('ruta3')
var Home = require('../view/home')
// var { h } = require('preact')

function start () {
    var router = Router()
    router.addRoute('/', function foo (match) {
        return Home
    })
    return router
}

module.exports = start
