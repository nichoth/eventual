var getAvatar = require('ssb-avatar')
var xtend = require('xtend')
var S = require('pull-stream')
var after = require('after')
var ts = require('./types')
var toURL = require('ssb-serve-blobs/id-to-url')
var createHash = require('multiblob/util').createHash
var fileReaderStream = require('filereader-pull-stream')
// var Catch = require('pull-catch')

function App (state, sbot) {
    var isDev = (process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test')
    if (isDev) {
        window.app = window.app || {}
        window.app.getUrlForHash = getUrlForHash
        window.app.toURL = toURL
    }

    function acceptInvite (invite) {
        return sbot.invite.accept(invite, function (err, res) {
            if (err) {
                console.log('pubs add err', err)
                return state.pubs.err.set(err)
            }

            console.log('pubs add', res)
            if (state.pubs.err()) state.pubs.err.set(null)
            state.pubs.list.set(res)
        })
    }

    function setName ({ id, name }, cb) {
        sbot.publish({
            type: 'about',
            about: id,
            name: name
        }, cb)
    }

    function setAvatar ({ id, fileId }, cb) {
        console.log('set avatar', arguments)
        sbot.publish({
            type: 'about',
            about: id,
            image: fileId
        }, cb)
    }

    function getProfile (cb) {
        sbot.whoami(function (err, res) {
            if (err) throw err
            var { id } = res

            getAvatar(sbot, id, id, function (err, profile) {
                console.log('profile', profile)
                cb(err, profile)
            })
        })
    }

    function setProfile (newName) {
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
    }

    function getUrlForHash (hash, cb) {
        S(
            sbot.blobs.get(hash),
            // Catch(),
            S.collect(function (err, values) {
                if (err) {
                    // if you don't cb, the app just stops
                    // return cb(null)
                    // return console.log('err in getUrl', err)
                    return cb(err)
                }
                var blob = new Blob(values)
                var imageUrl = URL.createObjectURL(blob)
                cb(null, imageUrl)
            })
        )
    }

    function getUrlForPost () {
        return S(
            S.map(function onData (post) {
                if (!post.value.content.mentions) return null

                var hash = post.value.content.mentions[0] ?
                    post.value.content.mentions[0].link :
                    null
                if (!hash) return null
                if (hash[0] != '&') return null
                // console.log('mentions', post.value.content.mentions)
                return [hash, post]
            }),
            // S.asyncMap(function ([hash, post], cb) {
            //     console.log('blobs start', hash)
            //     S(
            //         sbot.blobs.get(hash),
            //         S.collect(function (err, res) {
            //             console.log('blobs.get', err, res)
            //             cb(err, [hash, post])
            //         })
            //     )
            // }),
            //
            // S.through(function ([hash, post]) {
            //     console.log('hash', hash)
            //     S(
            //         sbot.blobs.get(hash),
            //         S.collect(function (err, res) {
            //             console.log('blobs.get', err, res)
            //         })
            //     )
            // }),
            // S.filter(Boolean),
            S.map(function ([hash, post]) {
                return [hash, toURL(hash), post]
            })
        )
    }

    function getUrlsForPosts (posts, cb) {
        var _urls = {}
        var next = after(posts.length, done)
        function done (err, urls) {
            if (err) return cb(err)
            cb(null, urls)
        }

        var i = 0
        posts.forEach(function (post) {
            if (!post.value.content.mentions) {
                return next(null, _urls)
            }
            var hash = post.value.content.mentions[0] ?
                post.value.content.mentions[0].link :
                null

            // console.log('post')

            // var hash = post.value.content.mentions[0].link

            if (!hash) return next(null, _urls)
            if (hash[0] != '&') return next(null, _urls)

            i++
            console.log('i', i, hash)
            getUrlForHash(hash, function (err, url) {
                console.log('oooo', err, url)

                if (err) return console.log('err', err)
                _urls[hash] = url
                next(null, _urls)
                console.log('_urls', _urls)
            })
        })
    }

    function getPosts (cb) {
        S(
            sbot.messagesByType({
                type: ts.post,
                reverse: true,
                limit: 20
            }),
            S.collect(function (err, msgs) {
                if (err) return cb(err)
                cb(null, msgs)
            })
        )
    }

    function postStream () {
        return sbot.messagesByType({
            type: ts.post,
            // reverse: true,
            live: true
        })
    }

    // listen for live messages
    function liveUpdates () {
        console.log('live start')
        S(
            postStream(),
            // S.through(function (post) {
            //     // TODO -- fix this for image race condition
            //     // should create a URL simultaneously with state.post
            //     if (post.sync === true) return
            //     // if (!state.posts()) return state.posts.set([post])
            //     var arr = (state.posts() || [])
            //     arr.unshift(post)
            //     state.posts.set(arr)
            // }),
            S.filter(function (post) {
                return post.value
            }),
            getUrlForPost(),
            S.drain(function ([hash, url, post]) {
                console.log('live update', arguments)

                sbot.blobs.has(hash, function (err, res) {
                    if (!res) {
                        console.log('miss', err, res)

                        S(
                            sbot.blobs.get(hash),
                            S.collect(function (err, res) {
                                console.log('blobs.get', err, res)
                            })
                        )

                        sbot.blobs.want(hash, {}, function(err, res) {
                            console.log('want cb', err, res)
                        })
                    }
                })

                if (state().postUrls[hash]) return
                var newState = {}
                newState[hash] = url
                state.postUrls.set(xtend(state.postUrls(), newState))

                if (post.sync === true) return
                var arr = (state.posts() || [])
                arr.unshift(post)
                state.posts.set(arr)

            }, function done (err) {
                if (err) return console.log('error', err)
                console.log('all done', arguments)
            })
        )
    }

    function setAvatar (file, cb) {
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


    return {
        getPosts,
        getProfile,
        setName,
        setAvatar,
        getUrlForHash,
        getUrlsForPosts,
        getUrlForPost,
        postStream,
        liveUpdates,
        acceptInvite,
        setProfile,
        newPost
    }
}

module.exports = App
