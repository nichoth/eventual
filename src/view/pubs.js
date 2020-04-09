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
        var inv = (ev.target.elements.invite.value || '').trim()
        this.emit(evs.pubs.add, inv)
    }

    render (props) {
        var { pubs } = props

        return <div className="pubs-route">
            Add a pub
            <hr />
            <code>
                <pre>
                    ssb-pub.picodevelopment.nl:8008:@UFDjYpDN89OTdow4sqZP5eEGGcy+1eN/HNc5DMdMI0M=.ed25519~K0MgQE7srBFqw1/SavBJvtvf/XZx6MvC1Tb18ofENbU=
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
