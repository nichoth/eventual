var { h, Component } = require('preact')
var evs = require('../EVENTS')
var Err = require('./err')

class Pubs extends Component {
    constructor (props) {
        super(props)
        this.addPub = this.addPub.bind(this)
        this.emit = props.emit
    }

    addPub (ev) {
        ev.preventDefault()
        this.emit(evs.pubs.add, ev.target.elements.invite.value)
    }

    render (props) {
        var { pubs } = props

        return <div className="pubs-route">
            Add a pub
            <hr />
            <code>
                <pre>
                    gossip.noisebridge.info:8008:@2NANnQVdsoqk0XPiJG2oMZqaEpTeoGrxOHJkLIqs7eY=.ed25519~C9eCJm9na5L7Zc/tKif1k2/FHS2Ugfm+oHWs9ROT/V8=
                </pre>
            </code>
            Invite code: 
            <form onSubmit={this.addPub}>
                <input type="text" id="invite" name="invite" />
                <button type="submit">save</button>
            </form>

            {pubs.err ?
                <Err message={pubs.err.message} /> :
                null
            }
        </div>
    }
}

module.exports = Pubs
