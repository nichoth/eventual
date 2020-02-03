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
        console.log('setAvatar', ev.target.files)
        console.log('setAvatar', ev.target.value)

        saveAvatar(ev.target.files[0], function (err, res) {
            var { blob, hash } = res
            console.log('saved', err, res)
            var imageUrl = URL.createObjectURL(blob);
            state.avatarUrl.set(imageUrl)
            state.me.set(xtend(state.me(), {
                image: hash
            })),
            console.log('state', state())
        })
    })

    // should create the blob/url from the file object
    function saveAvatar (file, cb) {
        var hasher = createHash('sha256')

        S(
            fileReaderStream(file),
            hasher,
            sbot.blobs.add(function (err, hash) {
                if (err) return cb(err)
                sbot.publish({
                    type: 'about',
                    about: state.me().id,
                    image: {
                        link: '&' + hasher.digest
                        // width: widthInPx,   // optional, but recommended
                        // height: heightInPx, // optional, but recommended
                        // name: fileName,     // optional, but recommended
                        // size: sizeInBytes,  // optional, but recommended
                        // type: mimeType      // optional, but recommended
                    }
                }, function (err, res) {
                    if (err) return cb(err)
                    var opts = { res: res, hash: '&' + hasher.digest,
                        blob: file } 
                    cb(null, opts)
                })

                // S(
                //     sbot.blobs.get('&' + hasher.digest),
                //     S.collect(function (err, vals) {
                //         if (err) return cb(err)
                //         var blob = new Blob(vals);
                //     })
                // )
            })
        )
    }
}

module.exports = subscribe

