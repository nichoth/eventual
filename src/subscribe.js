var EVENTS = require('./EVENTS')

function subscribe({ state, view }) {
    view.on(EVENTS.hello.world, () => state.foo.set('bar'))
}

module.exports = subscribe
