var Start = require('./start')
var App = require('./app.js')
var S = require('pull-stream')

Start(function (err, { sbot, state }) {
    if (err) throw err

    var app = App(sbot)


    console.log('fooo', sbot.friends)
    // S(
    //     sbot.friends.stream(),
    //     S.collect(function (err, res) {
    //         console.log('here', err, res)
    //     })
    // )

    sbot.friends.stream(function (err, graph) {
        console.log('friends stream', err, graph)
    })


    app.getProfile(function (err, profile) {
        // need to get the avatar blob in here too from the hash/id
        // (returned in profile)
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
        console.log('getPosts state', state())
        app.getUrlsForPosts(res, function (err, urls) {
            if (err) throw err
            state.postUrls.set(urls)
        })
    })
})
