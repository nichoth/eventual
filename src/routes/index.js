var Router = require('ruta3')
var Home = require('../view/home')
var New = require('../view/new')
var Peers = require('../view/peers')
var Pubs = require('../view/pubs')
var evs = require('../EVENTS')

function start (emit) {
    var router = Router()
    router.addRoute('/', function foo (match) {
        // emit(evs.route.home, match)
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

