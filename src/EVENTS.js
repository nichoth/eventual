var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    hello: ['world']
})

module.exports = EVENTS
