var Start = require('./start')
var App = require('./app.js')
var S = require('pull-stream')
var xtend = require('xtend')

Start(function (err, { sbot, state }) {
    if (err) throw err

    var app = App(sbot)

    // S(
    //     sbot.friends.stream(),
    //     S.collect(function (err, res) {
    //         console.log('here', err, res)
    //     })
    // )


    // *logs a lot*
    // S(
    //     sbot.friends.createFriendStream({
    //         hops: 1
    //     }),
    //     S.log()
    // )


    // console.log('friends', sbot.friends)


    app.getProfile(function (err, profile) {
        if (err) throw err

        var hash = profile.image
        if (!hash) return state.me.set(profile)
        state.me.set(profile)
        app.getUrlForHash(hash, function (err, url) {
            if (err) throw err
            state.avatarUrl.set(url)
        })
    })

    app.getPosts(function (err, res) {
        if (err) throw err
        state.posts.set(res)
        console.log('state', state())

        S(
            S.values(res),
            app.getUrlForPost(),
            S.drain(function ([hash, url]) {
                console.log('data', [hash, url])
                var newState = {}
                newState[hash] = url
                state.postUrls.set(xtend(state.postUrls(), newState))
            }, function onEnd (err) {
                console.log('end get post urls', err)
            })
        )
    })
})
