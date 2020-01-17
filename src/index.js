var ok = require('@nichoth/ok')
var Client = require('./client')
var subscribe = require('./subscribe')
var State = require('./state')
var View = require('./view')
var evs = require('./EVENTS')
var S = require('pull-stream')
var getAvatar = require('ssb-avatar')

var state = State()
var { view } = ok(state, View, document.getElementById('content'))
var stuff = {}

// how to set your name?
Client({}, function (err, sbot) {
    if (err) {
        throw err
    }
    console.log('sbot', sbot)

    sbot.whoami(function (err, { id }) {
        if (err) throw err
        stuff.id = id
        getAvatar(sbot, id, id, function (err, profile) {
            if (err) throw err
            console.log('stuff', profile)
            state.me.set(profile)
        })
    })

    function setName ({ id, name }, cb) {
        sbot.publish({
            type: 'about',
            about: id,
            name: name
        }, cb)
    }

    function setAvatar ({ id, fileId }, cb) {
        sbot.publish({
            type: 'about',
            about: id,
            image: fileId
        }, cb)
    }

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

