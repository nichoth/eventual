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
        console.log('props', props)
        var { pubs } = props

        return <div>
            Add a pub
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
