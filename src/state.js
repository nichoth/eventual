var observ = require('observ')
var struct = require('observ-struct')

function State () {
    var state = struct({
        foo: observ('world'),
        route: struct({}),  // required
        me: observ({}),
        avatarUrl: observ(null),
        posts: observ(null),
        postUrls: observ(null)
    })
    return state
}

module.exports = State

