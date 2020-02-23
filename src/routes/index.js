var Router = require('ruta3')
var Home = require('../view/home')
var New = require('../view/new')
var Peers = require('../view/peers')
var Pubs = require('../view/pubs')

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

    router.addRoute('/pubs', function (match) {
        return Pubs
    })

    return router
}

module.exports = start

