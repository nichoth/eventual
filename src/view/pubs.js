var { h, Component } = require('preact')
var evs = require('../EVENTS')

class Pubs extends Component {
    constructor (props) {
        super(props)
        this.submit = this.submit.bind(this)
    }

    submit (ev) {
        ev.preventDefault()
        console.log('submit', ev)
        console.log('invite', ev.target.elements.invite.value)
    }

    render (props) {
        return <div>
            Add a pub
            <form onSubmit={this.submit}>
                <input type="text" id="invite" name="invite" />
                <button type="submit">save</button>
            </form>
        </div>
    }
}

module.exports = Pubs
