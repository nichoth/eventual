var { h } = require('preact')
var Router = require('../routes')
var EVENTS = require('../EVENTS')

function View (props) {
    var { emit } = props
    var router = Router()
    if (props.route.pathname) var m = router.match(props.route.pathname)
    if (m) var RouteView = m.action(m)
    if (!m) var RouteView = function NotFound (props) {
        return <div>Couldnt find that path</div>
    }

    return <div>
        hello {props.foo + ' '}
        <hr />
        <RouteView {...props} />
        <button onClick={emit(EVENTS.hello.world)}>emit event</button>
    </div>
}

module.exports = View
