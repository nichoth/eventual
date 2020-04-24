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
