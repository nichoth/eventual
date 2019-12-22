var ok = require('@nichoth/ok')
var struct = require('observ-struct')
var observ = require('observ')
var EVENTS = require('./EVENTS')
var state = struct({
    foo: observ('world'),
    route: struct({})  // required
})
var Client = require('./client')
var View = require('./view')
var subscribe = require('./subscribe')

Client({}, function (err, sbot) {
    sbot.whoami(function (err, who) {
        console.log('who', err, who)
    })
})

var { view } = ok(state, View, document.getElementById('content'))

subscribe({ state, view })

if (process.env.NODE_ENV === 'development') {
    window.app = { state, view, EVENTS }
}
