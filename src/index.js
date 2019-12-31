var ok = require('@nichoth/ok')
var struct = require('observ-struct')
var observ = require('observ')
var Client = require('./client')
var View = require('./view')
var subscribe = require('./subscribe')

function start (cb) {
    var state = struct({
        foo: observ('world'),
        route: struct({})  // required
    })

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
