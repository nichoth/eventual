var evs = require('./EVENTS')
var xtend = require('xtend')
// var S = require('pull-stream')

function subscribe({ state, view, sbot }) {
    view.on(evs.hello.world, () => state.foo.set('bar'))

    view.on(evs.profile.save, function (newName) {
        sbot.publish({
            type: 'about',
            about: state().me.id,
            name: newName
        }, function (err, msg) {
            if (err) throw err
            state.me.set(xtend(state.me(), {
                name: msg.value.content.name
            }))
        })
    })

    view.on(evs.profile.setAvatar, function (ev) {
        console.log('setAvatar', ev.target.files)
        console.log('setAvatar', ev.target.value)
   })
}

module.exports = subscribe
