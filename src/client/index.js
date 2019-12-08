// var ssbClient = require('ssb-client')
// var ssbKeys = require('ssb-keys')
var manifest = {"auth":"async","address":"sync","manifest":"sync","multiserver":{"parse":"sync","address":"sync"},"multiserverNet":{},"get":"async","createFeedStream":"source","createLogStream":"source","messagesByType":"source","createHistoryStream":"source","createUserStream":"source","createWriteStream":"sink","links":"source","add":"async","publish":"async","getAddress":"sync","getLatest":"async","latest":"source","latestSequence":"async","whoami":"sync","progress":"sync","status":"sync","getVectorClock":"async","version":"sync","help":"sync","seq":"async","usage":"sync","clock":"async","gossip":{"add":"sync","remove":"sync","connect":"async","disconnect":"async","changes":"source","reconnect":"sync","disable":"sync","enable":"sync","ping":"duplex","get":"sync","peers":"sync","help":"sync"},"replicate":{"changes":"source","upto":"source","request":"sync","block":"sync"},"backlinks":{"read":"source"}}

var S = require('pull-stream')
var wsClient = require('pull-ws/client')
var muxrpc = require('muxrpc')
// var manifest = require('../../manifest.json')
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

