var Start = require('./start')
var App = require('./app.js')
var S = require('pull-stream')

Start(function (err, { sbot, state }) {
    if (err) throw err

    var app = App(sbot)

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
            console.log('state', state())
        })
    })
})
