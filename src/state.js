var observ = require('observ')
var struct = require('observ-struct')

function State () {
    var state = struct({
        foo: observ('world'),
        route: struct({}),  // required
        me: observ({})
    })
    return state
}

module.exports = State

