var ok = require('@nichoth/ok')
var EVENTS = require('@nichoth/events/namespace')({
    hello: ['world']
})
var struct = require('observ-struct')
var observ = require('observ')
var state = struct({
    foo: observ('world'),
    route: struct({})  // required
})
var Client = require('./client')
var View = require('./view')

Client({}, function (err, sbot) {
    sbot.whoami(function (err, who) {
        console.log('who', err, who)
    })
})

var { view } = ok(state, View, document.getElementById('content'))
subscribe({ state, view })

function subscribe({ state, view }) {
    view.on(EVENTS.hello.world, () => state.foo.set('bar'))
}

if (process.env.NODE_ENV === 'development') {
    window.app = { state, view, EVENTS }
}
