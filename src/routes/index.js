var Router = require('ruta3')
var { h } = require('preact')

var router = Router()
router.addRoute('/', function foo (match) {
    return function (props) {
        return <div>foo</div>
    }
})

module.exports = router