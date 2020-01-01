var test = require('tape')
var App = require('../src')

var _sbot
test('doesnt explode', function (t) {
    App(function (err, sbot) {
        t.error(err)
        t.ok(sbot)
        _sbot = sbot
        t.end()
    })
})

test('all done', function (t) {
    _sbot.close(function (err) {
        t.error(err, 'no error')
        t.end()
    })
})

