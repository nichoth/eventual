var { h, Component } = require('preact')

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
        this.props.onSave(ev.target.name.value)
    }

    render (props, state) {
        if (state.isEditing) {
            return <form onSubmit={this.save}>
                <input value={props.name} name="name" />
                <button type="submit">save</button>
                <button onClick={this.noEdit}>cancel</button>
            </form>
        }

        // pencil emoji
        return <span>
            {props.name} <button onClick={this.edit}>✏</button>
        </span>
    }
}

module.exports = EditableField
