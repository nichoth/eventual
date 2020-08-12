var evs = require('./EVENTS')
var xtend = require('xtend')
var S = require('pull-stream')
var fileReaderStream = require('filereader-pull-stream')
var createHash = require('multiblob/util').createHash
var ts = require('./types')

function subscribe({ state, view, sbot, app }) {
    view.on('*', function (ev) {
        console.log('ev', ev)
    })

    view.on(evs.app.start, (ev) => {
        console.log('start', ev)
    })

    view.on(evs.hello.world, () => state.foo.set('bar'))

    view.on(evs.pubs.add, function (invite) {
        sbot.invite.accept(invite, function (err, res) {
            if (err) {
                console.log('pubs add err', err)
                return state.pubs.err.set(err)
            }

            console.log('pubs add', res)
            if (state.pubs.err()) state.pubs.err.set(null)
            state.pubs.list.set(res)
        })
    })

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

    function newPost ({ image, text }, cb) {
        var hasher = createHash('sha256')

        S(
            fileReaderStream(image),
            hasher,
            sbot.blobs.add(function (err, _hash) {
                if (err) throw err
                var hash = '&' + hasher.digest
                
                sbot.publish({
                    type: ts.post,
                    text: text || '',
                    mentions: [{
                        link: hash,        // the hash given by blobs.add
                    //   name: 'hello.txt', // optional, but recommended
                    //   size: 12,          // optional, but recommended
                    //   type: 'text/plain' // optional, but recommended
                    }]
                }, function (err, data) {
                    // console.log('new post', err, data, _hash)
                    if (err) return cb(err)
                    cb.apply(null, arguments)
                })
            })
        )
    }

    view.on(evs.post.new, function ({ image, text }) {
        console.log('new start', text)
        newPost({ image, text }, function (err, res) {
            // do we set state here? or is it ok emitted in the live updates
            console.log('published msg', err, res)
        })
    })

    view.on(evs.route.home, function (match) {
        console.log('home event', match)
    })
}

module.exports = subscribe

