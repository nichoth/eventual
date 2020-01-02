var ok = require('@nichoth/ok')
var Client = require('./client')
var subscribe = require('./subscribe')
var State = require('./state')
var View = require('./view')

function start (cb) {
    var state = State()
    var { view } = ok(state, View, document.getElementById('content'))

    Client({}, function (err, sbot) {
        if (err) {
            if (cb) return cb(err)
            throw err
        }
        // sbot.whoami(function (err, who) {
        //     console.log('who', err, who)
        // })
        subscribe({ state, view, sbot })
        if (cb) cb(null, sbot)
    })

    if (process.env.NODE_ENV === 'development') {
        if (!window) return
        window.app = { state, view, EVENTS: require('./EVENTS') }
    }
}

if (require.main === module) {
    start()
}

module.exports = start

