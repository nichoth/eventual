var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    hello: ['world'],
    profile: ['save', 'setAvatar'],
    post: ['new'],
    pubs: ['add'],
    route: ['home']
})

module.exports = EVENTS
