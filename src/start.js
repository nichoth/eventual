var ok = require('@nichoth/ok')
var Client = require('./client')
var subscribe = require('./subscribe')
var State = require('./state')
var View = require('./view')
var evs = require('./EVENTS')
var Router = require('./routes')

function start (cb) {
    var state = State()
    var router = Router()
    var { view } = ok(state, View, document.getElementById('content'), {
        onRoute: function (route) {
            var m = router.match(route.href)
            // emit the route events
            // should do this less wonky
            if (m) var { events } = m.action(m)
            events.forEach(function(ev) {
                console.log('ev', ev)
                view.emit(ev, m)
            })
        }
    })

    Client({}, function (err, sbot) {
        if (err) {
            if (cb) return cb(err)
            throw err
        }

        subscribe({ state, view, sbot })

        if (cb) cb(null, { sbot, state, view })
    })

    if (process.env.NODE_ENV === 'development') {
        window.app = { state, view, EVENTS: evs }
    }
}

module.exports = start
