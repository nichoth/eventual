var sbot = require('ssb-server')
var http = require('http')
var url = require('url')
var ws = require('pull-ws/server')
var muxrpc = require('muxrpc')
var S = require('pull-stream')
var rimraf = require('rimraf')
var home = require('user-home')
var caps = require('../caps.json')
// var config = require('ssb-config')
var WS_PORT = 8000
var manifest = require('../manifest.json')

// // add plugins
// Server
//   .use(require('ssb-master'))
//   .use(require('ssb-gossip'))
//   .use(require('ssb-replicate'))
//   .use(require('ssb-backlinks'))

// var server = Server(config)

var ssbKeys = require('ssb-keys')
var ssbConfigInject = require('ssb-config/inject')
var path = require('path')
// var sbot = require('scuttlebot')

// @TODO check if global sbot is running and use that if possible
function startSSB () {
    // var {
    //     SBOT_SHS,
    //     SBOT_SIGN,
    //     APP_NAME,
    //     NODE_ENV
    // } = process.env

    // use dev database
    var appName = 'ssb-ev'
    if (process.env.NODE_ENV === 'development') {
        appName = 'ssb-ev-DEV'
    } else if (process.env.NODE_ENV === 'test') {
        appName = 'ssb-ev-TEST-' + Math.random()
    }

    if (process.env.NODE_ENV === 'test') {
        process.on('exit', function () {
            rimraf.sync(home + '/.' + appName)
        })
    }

    var opts = {}
    opts.caps = caps
    // if (process.env.NODE_ENV === 'development') {
    //     // opts.caps = {
    //     //     shs: SBOT_SHS,
    //     //     sign: SBOT_SIGN
    //     // }
    // }

    var config = ssbConfigInject(appName, opts)
    // console.log('config', config)

    var keyPath = path.join(config.path, 'secret')
    config.keys = ssbKeys.loadOrCreateSync(keyPath)
    // error, warning, notice, or info (Defaults to notice)
    config.logging.level = 'notice'

    var _sbot = sbot
        .use(require('ssb-master'))
        .use(require('ssb-gossip'))
        .use(require('ssb-replicate'))
        .use(require('ssb-backlinks'))
        .use(require('ssb-blobs'))
        .use(require('ssb-serve-blobs'))

        // .use(require('scuttlebot/plugins/plugins'))
        // .use(require('scuttlebot/plugins/master'))
        // .use(require('scuttlebot/plugins/gossip'))
        // .use(require('scuttlebot/plugins/replicate'))
        // .use(require('ssb-friends'))
        // .use(require('ssb-blobs'))
        // .use(require('ssb-serve-blobs'))
        // .use(require('ssb-backlinks'))
        // .use(require('ssb-private'))
        // .use(require('ssb-about'))
        // .use(require('ssb-contacts'))
        // .use(require('ssb-query'))
        // .use(require('scuttlebot/plugins/invite'))
        // .use(require('scuttlebot/plugins/local'))
        .call(null, config)

    var server = http.createServer(function onRequest (req, res) {
        console.log('got request')
        var { pathname } = url.parse(req.url)
        console.log('req pathname', pathname)
    }).listen(WS_PORT, function (err) {
        if (err) throw err
        console.log('listening on 8000')
    })

    ws({ server }, function onConnection (wsStream) {
        console.log('got ws connection')

        // arguments are (remote, local)
        var rpcServer = muxrpc(null, manifest)(_sbot)
        var rpcServerStream = rpcServer.createStream(function onEnd (err) {
            console.log('rpc stream close', err)
        })

        S(wsStream, rpcServerStream, wsStream)
    })

    return _sbot
}

if (require.main === module) {
    startSSB()
}

// for tests in test-browser
process.on('SIGTERM', function () {
    process.exit(0)
})

module.exports = startSSB

