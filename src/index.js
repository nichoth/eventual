var Start = require('./start')
var App = require('./app.js')
var S = require('pull-stream')
var xtend = require('xtend')

Start(function (err, { sbot, state }) {
    if (err) throw err

    var app = App(sbot)

    // *logs a lot*
    // S(
    //     sbot.friends.createFriendStream({
    //         hops: 1
    //     }),
    //     S.log()
    // )


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

    // listen for live messages
    S(
        app.postStream(),
        app.getUrlForPost(),
        S.drain(function ([hash, url]) {
            console.log('in drain', [hash, url])
            if (state.postUrls[hash]) return
            var newState = {}
            newState[hash] = url
            state.postUrls.set(xtend(state.postUrls(), newState))
        })
    )

    app.getPosts(function (err, res) {
        if (err) throw err
        state.posts.set(res)

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
