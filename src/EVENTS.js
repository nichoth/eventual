var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    hello: ['world'],
    profile: ['save', 'setAvatar']
})

module.exports = EVENTS
