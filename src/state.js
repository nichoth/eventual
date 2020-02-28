var observ = require('observ')
var struct = require('observ-struct')

function State () {
    var state = struct({
        foo: observ('world'),
        route: struct({}),  // required
        me: observ({}),
        avatarUrl: observ(null),
        posts: observ(null),
        postUrls: observ(null),
        pubs: struct({
            list: observ([]),
            err: observ(null)
        })
    })
    return state
}

module.exports = State

