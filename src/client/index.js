// var ssbClient = require('ssb-client')
// var ssbKeys = require('ssb-keys')
var manifest = require('../manifest.json')
var S = require('pull-stream')
var wsClient = require('pull-ws/client')
var muxrpc = require('muxrpc')
var WS_URL = 'ws://localhost:8000'

function connectSbot ({ onClose } = {}, cb) {
    wsClient(WS_URL, {
        binary: true,
        onConnect
    })

    function onConnect (err, wsStream) {
        if (err) return cb(err)

        // sbot is rpc client
        var sbot = muxrpc(manifest, null)()
        var rpcStream = sbot.createStream(function _onClose (err) {
            if (onClose) onClose(err)
        })
        S(wsStream, rpcStream, wsStream)

        // console.log('sbot', sbot)

        cb(null, sbot)
    }
}

module.exports = connectSbot


// simplest usage, connect to localhost sbot
// this will cb with an error if an sbot server is not running
// ssbClient(function (err, sbot) {
// ...
// })

// function start (cb) {
    // var keys = ssbKeys.loadOrCreateSync('./app-private.key')
    // ssbClient(
    //     keys,                // optional, defaults to ~/.ssb/secret
    //     {
    //         host: 'localhost', // optional, defaults to localhost
    //         port: 8008,        // optional, defaults to 8008
    //         key: keys.id,      // optional, defaults to keys.id

    //         caps: {
    //             // random string for `appKey` in secret-handshake
    //             shs: '123'
    //         },

    //         // optional, muxrpc manifest. Defaults to ~/.ssb/manifest.json
    //         manifest: manifest
    //     },

    //     function (err, sbot, config) {
    //         cb(err, sbot, config)
    //         console.log('cb', err, sbot)
    //     }
    // )

// }

// if (require.main === module) {
//     start()
// }

// module.exports = start

