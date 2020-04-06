var observ = require('observ')
var struct = require('observ-struct')

function State () {
    var state = struct({
        foo: observ('world'),
        route: struct({}),  // required
        me: observ({}),
        avatarUrl: observ(null),
        posts: observ(null),
        postUrls: observ({}),
        pubs: struct({
            list: observ([]),
            err: observ(null)
        })
    })

    // state(function onChange (_state) {
    //     console.log('change', _state)
    // })
    return state
}

module.exports = State

