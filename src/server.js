var Server = require('ssb-server')
var config = require('ssb-config')
// var fs = require('fs')
// var path = require('path')

// add plugins
Server
  .use(require('ssb-master'))
  .use(require('ssb-gossip'))
  .use(require('ssb-replicate'))
  .use(require('ssb-backlinks'))

var server = Server(config)

// save an updated list of methods this server has made public
// in a location that ssb-client will know to check
// var manifest = server.getManifest()
// fs.writeFileSync(
//   path.join(__dirname, '/manifest.json'), // ~/.ssb/manifest.json
//   JSON.stringify(manifest)
// )
