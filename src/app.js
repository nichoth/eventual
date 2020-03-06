var getAvatar = require('ssb-avatar')
var S = require('pull-stream')
var after = require('after')

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
            S.collect(function (err, values) {
                if (err) return cb(err)
                var blob = new Blob(values);
                var imageUrl = URL.createObjectURL(blob);
                cb(null, imageUrl)
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

        posts.forEach(function (post) {
            if (!post.value.content.mentions) {
                return next(null, _urls)
            }
            var hash = post.value.content.mentions[0] ?
                post.value.content.mentions[0].link :
                null

            if (!hash) return next(null, _urls)

            getUrlForHash(hash, function (err, url) {
                if (err) return console.log('err', err)
                _urls[hash] = url
                next(null, _urls)
            })
        })
    }

    function getPosts (cb) {
        console.log('getposts')
        S(
            sbot.messagesByType({
                // todo: changge post type
                type: 'post',
                reverse: true,
                limit: 20
            }),
            S.collect(function (err, msgs) {
                if (err) return cb(err)
                console.log('msgs', msgs)
                cb(null, msgs)
            })
        )
    }

    return {
        getPosts,
        getProfile,
        setName,
        setAvatar,
        getUrlForHash,
        getUrlsForPosts
    }
}

module.exports = App
