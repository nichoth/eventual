var evs = require('./EVENTS')
var xtend = require('xtend')
var S = require('pull-stream')
var createHash = require('multiblob/util').createHash
var ts = require('./types')

function subscribe({ state, view, app }) {
    view.on('*', function (ev) {
        console.log('ev', ev)
    })

    view.on(evs.app.start, (ev) => {
        console.log('start', ev)

        app.liveUpdates()

        app.getProfile(function (err, profile) {
            if (err) throw err
            var hash = profile.image
            if (!hash) return state.me.set(profile)
            app.getUrlForHash(hash, function (err, url) {
                // if (err) throw err
                if (err) return console.log('err profile', err)
                state.avatarUrl.set(url)
                state.me.set(profile)
            })
        })
    })

    view.on(evs.hello.world, () => state.foo.set('bar'))

    view.on(evs.pubs.add, function (invite) {
        app.acceptInvite(invite)
    })

    view.on(evs.profile.save, function (newName) {
        app.setProfile(newName)
        // sbot.publish({
        //     type: 'about',
        //     about: state().me.id,
        //     name: newName
        // }, function (err, msg) {
        //     if (err) throw err
        //     state.me.set(xtend(state.me(), {
        //         name: msg.value.content.name
        //     }))
        // })
    })

    view.on(evs.profile.setAvatar, function (ev) {
        var file = ev.target.files[0]
        console.log('file', file)
        saveAvatar(file, function (err, { hash }) {
            if (err) throw err
            // var { /*blob,*/ hash } = res
            var imageUrl = URL.createObjectURL(file)
            // var imageUrl = URL.createObjectURL(blob);
            state.me.set(xtend(state.me(), {
                image: hash
            }))
            state.avatarUrl.set(imageUrl)
        })
    })

    function saveAvatar (file, cb) {
        app.setAvatar(file, function (err, res) {
            console.log('set avi', err, res)
        })
    }

    view.on(evs.post.new, function ({ image, text }) {
        console.log('new start', text)
        app.newPost({ image, text }, function (err, res) {
            // do we set state here? or is it ok emitted in the live updates
            console.log('published msg', err, res)
        })
    })

    view.on(evs.route.home, function (match) {
        console.log('home event', match)
    })
}

module.exports = subscribe

