var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    hello: ['world'],
    profile: ['save', 'setAvatar'],
    post: ['new']
})

module.exports = EVENTS
