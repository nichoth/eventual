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
        var file = ev.target.files[0]
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
                    var opts = { res: res, hash: '&' + hasher.digest }
                        // /*blob: file*/ } 
                    cb(null, opts)
                })
            })
        )
    }

    function newPost (file, cb) {
        var hasher = createHash('sha256')

        S(
            fileReaderStream(file),
            hasher,
            sbot.blobs.add(function (err, _hash) {
                if (err) throw err
                console.log('added blob', err, hasher.digest, _hash)
                var hash = '&' + hasher.digest
                
                sbot.publish({
                    type: 'post',
                    text: 'checkout [this file!]('+hash+')',
                    mentions: [{
                      link: hash,        // the hash given by blobs.add
                    //   name: 'hello.txt', // optional, but recommended
                    //   size: 12,          // optional, but recommended
                    //   type: 'text/plain' // optional, but recommended
                    }]
                }, cb)
            })
        )
    }

    view.on(evs.post.new, function (ev) {
        console.log('new', ev)
        var file = ev.target.files[0]
        newPost(file, function (err, res) {
            console.log('published msg', err, res)
        })
    })
}

module.exports = subscribe

