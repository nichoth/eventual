var getAvatar = require('ssb-avatar')
var S = require('pull-stream')

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

    function getPosts (cb) {
        S(
            sbot.createLogStream({
                reverse: true,
                limit: 20
            }),
            S.collect(function (err, msgs) {
                if (err) return cb(err)
                cb(null, msgs)
            })
        )
    }

    return {
        getPosts,
        getProfile,
        setName,
        setAvatar,
        getUrlForHash
    }
}

module.exports = App
