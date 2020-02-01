var evs = require('./EVENTS')
var xtend = require('xtend')
var S = require('pull-stream')
// var blobFiles = require('ssb-blob-files')
var fileReaderStream = require('filereader-pull-stream')

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
        var reader = new FileReader()
        reader.onload = function (ev) {
            console.log('ev', ev)
            // console.log('.result', ev.target.result)
        }
        reader.readAsDataURL(ev.target.files[0])

        // take reader.result and turn it into a pull stream
        // see ssb-blob-files for an example
        // then pipe it to sbot.blobs.add
        // check that you get back a hash (file id) from that method call

        console.log('setAvatar', ev.target.files)
        console.log('setAvatar', ev.target.value)
        S(
            fileReaderStream(ev.target.files[0]),
            sbot.blobs.add(function (err, hash) {
                console.log('please work', err, hash)
            })
        )

        // blobFiles(ev.target.files, sbot, function (err, res) {
        //     console.log('here', err, res)
        // })
    })
}

module.exports = subscribe

