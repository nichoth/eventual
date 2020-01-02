var { h } = require('preact')
var router = require('../routes')
var EVENTS = require('../EVENTS')

function View (props) {
    var { emit } = props
    if (props.route.pathname) var m = router.match(props.route.pathname)
    if (m) var RouteView = m.action(m)

    return <div>
        <RouteView {...props} />
        <hr />
        hello {props.foo + ' '}
        <button onClick={emit(EVENTS.hello.world)}>emit event</button>
    </div>
}

module.exports = View

