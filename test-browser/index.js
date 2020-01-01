var test = require('tape')
var App = require('../src')

test('doesnt explode', function (t) {
    App(function (err, sbot) {
        t.error(err)
        t.ok(sbot)
        sbot.close(function (err) {
            console.log('close', err)
            t.end()
        })
    })
})

