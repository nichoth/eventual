var sbot = require('ssb-server')
// var config = require('ssb-config')

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
    var {
        SBOT_SHS,
        SBOT_SIGN,
        APP_NAME,
        NODE_ENV
    } = process.env
    console.log('env', SBOT_SHS, SBOT_SIGN, APP_NAME, NODE_ENV)

    // use dev database
    var appName = NODE_ENV === 'development' ? 'evt-DEV' : undefined
    appName = APP_NAME ? APP_NAME : appName

    var opts = {}
    if (process.env.NODE_ENV === 'development') {
        opts.caps = {
            shs: SBOT_SHS,
            sign: SBOT_SIGN
        }
    }

    var config = ssbConfigInject(appName, opts)
    console.log('config', config)

    var keyPath = path.join(config.path, 'secret')
    config.keys = ssbKeys.loadOrCreateSync(keyPath)
    // error, warning, notice, or info (Defaults to notice)
    config.logging.level = 'notice'

    var _sbot = sbot
        .use(require('ssb-master'))
        .use(require('ssb-gossip'))
        .use(require('ssb-replicate'))
        .use(require('ssb-backlinks'))
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

    return _sbot
}

module.exports = startSSB

if (require.main === module) {
    startSSB()
}
