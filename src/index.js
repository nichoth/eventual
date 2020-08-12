var Start = require('./start')
var App = require('./app.js')
var evs = require('./EVENTS')
var S = require('pull-stream')
// var xtend = require('xtend')
var subscribe = require('./subscribe')
// const subscribe = require('./subscribe')

Start(function (err, { sbot, state, view }) {
    if (err) throw err

    var app = App(state, sbot)


    // @todo
    subscribe({ app, view, state, sbot })



    view.emit(evs.app.start, { ok: 'ok' })

    app.liveUpdates()



    // console.log('wants', sbot.blobs.ls(() => console.log(arguments)))
    // S(
    //     sbot.blobs.ls(),
    //     S.log(),
    //     S.drain(() => console.log('done', arguments))
    // )

    // *logs a lot*
    // S(
    //     sbot.friends.createFriendStream({
    //         hops: 1
    //     }),
    //     S.log()
    // )

    console.log('gossip', sbot.gossip)

    // sbot.gossip.peers(function (err, res) {
    //     console.log('peers', err, res)
    // })

    // sbot.gossip.add({
    //     host:'localhost',
    //     port: 8000,
    //     key: '@fZu02XAvFo/dQG5Vhv4qo4zzIvBphcnq9Z9XI5J7cDA=.ed25519'
    // }, function (err, res) {
    //     console.log('ok', arguments)
    // })



    // app.getPosts(function (err, res) {
    //     if (err) throw err
    //     state.posts.set(res)
    //     console.log('posts', res)
    //     // liveUpdates()

    //     S(
    //         S.values(res),
    //         app.getUrlForPost(),
    //         S.drain(function ([hash, url]) {
    //             console.log('data', [hash, url])
    //             var newState = {}
    //             newState[hash] = url
    //             state.postUrls.set(xtend(state.postUrls(), newState))
    //         }, function onEnd (err) {
    //             console.log('end get post urls', err)
    //         })
    //     )
    // })
})
