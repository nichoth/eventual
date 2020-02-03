var getAvatar = require('ssb-avatar')

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
            console.log('who', res)

            getAvatar(sbot, id, id, function (err, profile) {
                console.log('profile', profile)
                cb(err, profile)
            })
        })
    }

    return {
        getProfile,
        setName,
        setAvatar
    }
}

module.exports = App
