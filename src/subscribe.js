var evs = require('./EVENTS')

function subscribe({ state, view, sbot }) {
    view.on(evs.hello.world, () => state.foo.set('bar'))

    view.on(evs.profile.save, function (newName) {
        console.log('save in here', newName)
    })
}

module.exports = subscribe
