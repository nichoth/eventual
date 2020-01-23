var test = require('tape')
var start = require('../src/start')
var evs = require('../src/EVENTS')

var _sbot
var _view
var _state
test('doesnt explode', function (t) {
    start(function (err, { view, state, sbot }) {
        t.error(err)
        t.ok(sbot)
        _sbot = sbot
        _view = view
        _state = state
        t.end()
    })
})

test('set profile', function (t) {
    t.plan(1)
    _state.me(function onChange (val) {
        t.equal(val.name, 'blob', 'sets name in state')
    })
    _view.emit(evs.profile.save, 'blob')
})

test('all done', function (t) {
    _sbot.close(function (err) {
        t.error(err, 'no error')
        t.end()
    })
})

