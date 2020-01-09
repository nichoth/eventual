var ok = require('@nichoth/ok')
var Client = require('./client')
var subscribe = require('./subscribe')
var State = require('./state')
var View = require('./view')
var evs = require('./EVENTS')
var S = require('pull-stream')

var state = State()
var { view } = ok(state, View, document.getElementById('content'))

Client({}, function (err, sbot) {
    if (err) {
        throw err
    }
    console.log('sbot', sbot)

    S(
        sbot.createFeedStream(),
        S.through(console.log.bind(console, 'post')),
        S.onEnd(function (err) {
            console.log('done', err)
        })
    )

    // var msg = {
    //     type: 'post',
    //     test: 'first post'
    // }
    // sbot.publish(msg, function (err, data) {
    //     console.log('pub', err, data)
    // })

    // sbot.whoami(function (err, who) {
    //     console.log('who', err, who)
    // })
    subscribe({ state, view, sbot })
})

if (process.env.NODE_ENV === 'development') {
    window.app = { state, view, EVENTS: evs }
}
