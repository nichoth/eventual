var getAvatar = require('ssb-avatar')
var S = require('pull-stream')
var after = require('after')
var ts = require('./types')
// var Catch = require('pull-catch')

function App (sbot) {
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

    function getUrlForHash (hash, cb) {
        S(
            sbot.blobs.get(hash),
            // Catch(),
            S.collect(function (err, values) {
                if (err) {
                    // if you don't cb, the app just stops
                    return cb(null)
                    // return console.log('err in getUrl', err)
                    // return cb(err)
                }
                var blob = new Blob(values);
                var imageUrl = URL.createObjectURL(blob);
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
                return hash
            }),
            S.filter(Boolean),
            S.asyncMap(function (hash, cb) {
                getUrlForHash(hash, function (err, url) {
                    if (err) return cb(err)
                    cb(null, [hash, url])
                })
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

    return {
        getPosts,
        getProfile,
        setName,
        setAvatar,
        getUrlForHash,
        getUrlsForPosts,
        getUrlForPost,
        postStream
    }
}

module.exports = App
