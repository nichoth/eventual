var ok = require('@nichoth/ok')
var { h } = require('preact')
var EVENTS = require('@nichoth/events/namespace')({
    hello: ['world']
})
var struct = require('observ-struct')
var observ = require('observ')
var Router = require('ruta3')

var state = struct({
    foo: observ('world'),
    route: struct({})  // required
})

var Client = require('./client')

var router = Router()
router.addRoute('/', function foo (match) {
    return function (props) {
        return <div>foo</div>
    }
})

Client({}, function (err, sbot) {
    console.log('client', err, sbot)
    sbot.whoami(function (err, who) {
        console.log('who', err, who)
    })
})

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

var { view } = ok(state, View, document.getElementById('content'))
subscribe({ state, view })

function subscribe({ state, view }) {
    view.on(EVENTS.hello.world, () => state.foo.set('bar'))
}

if (process.env.NODE_ENV === 'development') {
    window.app = { state, view, EVENTS }
}
