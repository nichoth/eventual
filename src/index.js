var Start = require('./start')
var App = require('./app.js')

Start(function (err, { sbot, state }) {
    if (err) throw err

    var app = App(sbot)

    app.getProfile(function (err, profile) {
        // need to get the avatar blob in here too from the hash/id
        // (returned in profile)
        if (err) throw err
        state.me.set(profile)
    })
})
