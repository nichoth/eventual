var ok = require('@nichoth/ok')
var Client = require('./client')
var subscribe = require('./subscribe')
var State = require('./state')
var View = require('./view')
var evs = require('./EVENTS')

var state = State()
var { view } = ok(state, View, document.getElementById('content'))

Client({}, function (err, sbot) {
    if (err) {
        throw err
    }
    // sbot.whoami(function (err, who) {
    //     console.log('who', err, who)
    // })
    subscribe({ state, view, sbot })
})

if (process.env.NODE_ENV === 'development') {
    window.app = { state, view, EVENTS: evs }
}
