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
        sbot.publish({
            type: 'about',
            about: id,
            image: fileId
        }, cb)
    }

    function getProfile (cb) {
        sbot.whoami(function (err, { id }) {
            if (err) throw err
            stuff.id = id
            getAvatar(sbot, id, id, function (err, profile) {
                console.log('profile', profile)
                console.log('state', state())
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
