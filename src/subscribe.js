var evs = require('./EVENTS')

function subscribe({ state, view, sbot }) {
    view.on(evs.hello.world, () => state.foo.set('bar'))

    view.on(evs.profile.save, function (ev) {
        console.log('save in here', ev)
    })
}

module.exports = subscribe
