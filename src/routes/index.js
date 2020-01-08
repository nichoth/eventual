var Router = require('ruta3')
var { h } = require('preact')

function start () {
    var router = Router()
    router.addRoute('/', function foo (match) {
        return function (props) {
            return <div>foo</div>
        }
    })
    return router
}

module.exports = start
