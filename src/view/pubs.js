var { h, Component } = require('preact')
var evs = require('../EVENTS')

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
        return <div>
            Add a pub
            <form onSubmit={this.addPub}>
                <input type="text" id="invite" name="invite" />
                <button type="submit">save</button>
            </form>
        </div>
    }
}

module.exports = Pubs
