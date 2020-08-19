var Start = require('./start')
var App = require('./app.js')
var subscribe = require('./subscribe')

Start(function (err, { sbot, state, view }) {
    if (err) throw err
    // console.log('gossip', sbot.gossip)

    // *logs a lot*
    // S(
    //     sbot.friends.createFriendStream({
    //         hops: 1
    //     }),
    //     S.log()
    // )

    var app = App(state, sbot)

    subscribe({ app, view, state })
})
