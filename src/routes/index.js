var Router = require('ruta3')
var Home = require('../view/home')
var New = require('../view/new')
var Peers = require('../view/peers')

function start () {
    var router = Router()
    router.addRoute('/', function foo (match) {
        return Home
    })

    router.addRoute('/new', function (match) {
        return New
    })

    router.addRoute('/peers', function (match) {
        return Peers
    })

    return router
}

module.exports = start

