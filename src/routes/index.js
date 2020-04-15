var Router = require('ruta3')
var Home = require('../view/home')
var New = require('../view/new')
var Peers = require('../view/peers')
var Pubs = require('../view/pubs')
var evs = require('../EVENTS')

function start () {
    var router = Router()
    router.addRoute('/', function (match) {
        return { view: Home, events: [ evs.route.home ] }
    })

    router.addRoute('/new', function (match) {
        return { view: New, events: [] }
    })

    router.addRoute('/peers', function (match) {
        return { view: Peers, events: [] }
    })

    router.addRoute('/pubs', function (match) {
        return { view: Pubs, events: [] }
    })

    return router
}

module.exports = start

