var Router = require('ruta3')
var Home = require('../view/home')
var New = require('../view/new')

function start () {
    var router = Router()
    router.addRoute('/', function foo (match) {
        return Home
    })

    router.addRoute('/new', function (match) {
        return New
    })

    return router
}

module.exports = start

