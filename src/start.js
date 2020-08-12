var ok = require('@nichoth/ok')
var Client = require('./client')
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
            if (m && typeof m.action === 'function') {
                var { events } = m.action(m)
            }
            
            (events || []).forEach(function(ev) {
                view.emit(ev, m)
            })
        }
    })

    Client({}, function (err, sbot) {
        if (err) {
            if (cb) return cb(err)
            throw err
        }

        if (process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'test') {
            window.app = { state, view, EVENTS: evs, sbot }
        }

        if (cb) cb(null, { sbot, state, view })
    })
}

module.exports = start
