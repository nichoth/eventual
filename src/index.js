var Start = require('./start')
var App = require('./app.js')
var evs = require('./EVENTS')
var S = require('pull-stream')
var xtend = require('xtend')
var subscribe = require('./subscribe')
// const subscribe = require('./subscribe')

Start(function (err, { sbot, state, view }) {
    if (err) throw err

    var app = App(sbot)


    // @todo
    subscribe({ app, view, state, sbot })



    view.emit(evs.app.start, { ok: 'ok' })



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

    app.getProfile(function (err, profile) {
        if (err) throw err
        var hash = profile.image
        if (!hash) return state.me.set(profile)
        app.getUrlForHash(hash, function (err, url) {
            // if (err) throw err
            if (err) return console.log('err profile', err)
            state.avatarUrl.set(url)
            state.me.set(profile)
        })
    })

    // listen for live messages
    function liveUpdates () {
        console.log('live start')
        S(
            app.postStream(),
            // S.through(function (post) {
            //     // TODO -- fix this for image race condition
            //     // should create a URL simultaneously with state.post
            //     if (post.sync === true) return
            //     // if (!state.posts()) return state.posts.set([post])
            //     var arr = (state.posts() || [])
            //     arr.unshift(post)
            //     state.posts.set(arr)
            // }),
            S.filter(function (post) {
                return post.value
            }),
            app.getUrlForPost(),
            S.drain(function ([hash, url, post]) {
                console.log('live update', arguments)

                sbot.blobs.has(hash, function (err, res) {
                    if (!res) {
                        console.log('miss', err, res)

                        S(
                            sbot.blobs.get(hash),
                            S.collect(function (err, res) {
                                console.log('blobs.get', err, res)
                            })
                        )

                        sbot.blobs.want(hash, {}, function(err, res) {
                            console.log('want cb', err, res)
                        })
                    }
                })

                if (state.postUrls[hash]) return
                var newState = {}
                newState[hash] = url
                state.postUrls.set(xtend(state.postUrls(), newState))

                if (post.sync === true) return
                var arr = (state.posts() || [])
                arr.unshift(post)
                state.posts.set(arr)

            }, function done (err) {
                if (err) return console.log('error', err)
                console.log('all done', arguments)
            })
        )
    }

    liveUpdates()

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
