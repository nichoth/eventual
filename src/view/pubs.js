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
            <code>{
                // eslint-disable-next-line
                }<pre>scuttle.us:8008:@ihnyNrsm+7pqHkhnF4u5CkU5VSGlK6YNqRDfHwiUPWM=.ed25519~qdS6CdOhqE1oyNL6d8VfGDrD9/VJDPoKQ7twlcQNaHc=</pre>
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
