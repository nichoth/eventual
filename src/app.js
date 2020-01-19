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

    return {
        setName,
        setAvatar
    }
}

module.exports = App
