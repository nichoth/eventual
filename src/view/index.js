var { h, Component } = require('preact')
var Router = require('../routes')
var EVENTS = require('../EVENTS')

class EditableField extends Component {
    constructor() {
        super()
        this.state = {
            isEditing: false
        }
        this.edit = this.edit.bind(this)
        this.noEdit = this.noEdit.bind(this)
        this.save = this.save.bind(this)
    }

    edit(ev) {
        ev.preventDefault()
        this.setState({ isEditing: true })
    }

    noEdit (ev) {
        ev.preventDefault()
        this.setState({ isEditing: false })
    }

    save (ev) {
        ev.preventDefault()
        console.log('save', ev)
    }

    render (props, state) {
        // pencil emoji
        if (state.isEditing) {
            return <form onSubmit={this.save}>
                <input value={props.name} />
                <button type="submit">save</button>
                <button onClick={this.noEdit}>cancel</button>
            </form>
        }

        return <span>
            {props.name} <button onClick={this.edit}>✏</button>
        </span>
    }
}


function View (props) {
    var { emit } = props
    var router = Router()
    if (props.route.pathname) var m = router.match(props.route.pathname)
    if (m) var RouteView = m.action(m)
    if (!m) var RouteView = function NotFound (props) {
        return <div>Couldnt find that path</div>
    }

    var field = props.me.name ?
        <EditableField name={props.me.name} /> :
        ''

    return <div>
        <div className="menu">
            {field} <a href="/new">+</a>
        </div>

        <hr />
        <RouteView {...props} />
        <button onClick={emit(EVENTS.hello.world)}>emit event</button>
    </div>
}



module.exports = View

