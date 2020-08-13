var Start = require('./start')
var App = require('./app.js')
var evs = require('./EVENTS')
var subscribe = require('./subscribe')

Start(function (err, { sbot, state, view }) {
    if (err) throw err
    console.log('gossip', sbot.gossip)

    var app = App(state, sbot)

    subscribe({ app, view, state, sbot })

    view.emit(evs.app.start, { ok: 'ok' })
})
