var evs = require('./EVENTS')

function subscribe({ state, view, sbot }) {
    view.on(evs.hello.world, () => state.foo.set('bar'))

    view.on(evs.profile.save, function (newName) {
        console.log('save in here', newName)
        console.log('state', state())

        sbot.publish({
            type: 'about',
            about: state().me.id,
            name: newName
        }, function (err, msg) {
            state.me.name.set(msg.value.content.name)
            console.log('here', err, msg)
            console.log(msg.value.content.name)
        })

        console.log('state2', state())
    })
}

module.exports = subscribe
