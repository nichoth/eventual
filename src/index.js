var ok = require('@nichoth/ok')
var struct = require('observ-struct')
var observ = require('observ')
var Client = require('./client')
var View = require('./view')
var subscribe = require('./subscribe')

var state = struct({
    foo: observ('world'),
    route: struct({})  // required
})

Client({}, function (err, sbot) {
    sbot.whoami(function (err, who) {
        console.log('who', err, who)
    })
    subscribe({ state, view, sbot })
})

var { view } = ok(state, View, document.getElementById('content'))

if (process.env.NODE_ENV === 'development') {
    window.app = { state, view, EVENTS: require('./EVENTS') }
}
