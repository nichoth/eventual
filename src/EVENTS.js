var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    hello: ['world'],
    profile: ['save', 'setAvatar'],
    post: ['new'],
    pubs: ['add']
})

module.exports = EVENTS
