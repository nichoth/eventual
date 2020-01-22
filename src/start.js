var ok = require('@nichoth/ok')
var Client = require('./client')
var subscribe = require('./subscribe')
var State = require('./state')
var View = require('./view')
var evs = require('./EVENTS')

function start (cb) {
    var state = State()
    var { view } = ok(state, View, document.getElementById('content'))

    Client({}, function (err, sbot) {
        if (err) {
            if (cb) return cb(err)
            throw err
        }

        subscribe({ state, view, sbot })

        if (cb) {
            cb(null, { app, sbot, state, view })
        }
    })

    if (process.env.NODE_ENV === 'development') {
        window.app = { state, view, EVENTS: evs }
    }
}

module.exports = start

        // S(
        //     sbot.createFeedStream(),
        //     S.through(console.log.bind(console, 'post')),
        //     S.onEnd(function (err) {
        //         console.log('done', err)
        //     })
        // )

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
