var evs = require('./EVENTS')
var xtend = require('xtend')
var S = require('pull-stream')
// var blobFiles = require('ssb-blob-files')
var fileReaderStream = require('filereader-pull-stream')
// var toPull = require('stream-to-pull-stream')
var createHash = require('multiblob/util').createHash

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
        // take reader.result and turn it into a pull stream
        // see ssb-blob-files for an example
        // then pipe it to sbot.blobs.add
        // check that you get back a hash (file id) from that method call

        console.log('setAvatar', ev.target.files)
        console.log('setAvatar', ev.target.value)

        saveAvatar (ev.target.files[0], function (err, res) {
            var { blob } = res
            console.log('saved', err, res)
            var imageUrl = URL.createObjectURL( blob );
            state.avatarUrl.set(imageUrl)
        })

        // sbot.publish({type: 'about', about: yourId, image: fileId}, cb)
        // state.avatarUrl.set(imageUrl)
    })

    function saveAvatar (file, cb) {
        var hasher = createHash('sha256')

        S(
            fileReaderStream(file),
            hasher,
            sbot.blobs.add(function (err, hash) {
                if (err) return cb(err)
                S(
                    sbot.blobs.get('&' + hasher.digest),
                    S.collect(function (err, vals) {
                        var blob = new Blob(vals);
                        cb(null, { hash: hasher.digest, blob })
                    })
                )
            })
        )
    }
}

module.exports = subscribe

