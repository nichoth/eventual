var { h, Component } = require('preact')
var evs = require('../EVENTS')

function FilePreview (props) {
    var { selectedFile } = props

    function nevermind (ev) {
        ev.preventDefault()
        props.nevermind()
    }

    return <form className="file-preview" onSubmit={props.savePost}>
        <div className="image">
            <img src={URL.createObjectURL(selectedFile)} />
        </div>

        <div className="text">
            <textarea id="text" name="text" />
        </div>

        <div className="controls">
            <button onClick={nevermind}>Nevermind</button>
            <button type="submit">Save</button>
        </div>
    </form>
}

class New extends Component {
    constructor (props) {
        super()
        this.state = {
            selectedFile: null
        }

        this.savePost = this.savePost.bind(this)
        this.nevermind = this.nevermind.bind(this)
        this.chooseFile = this.chooseFile.bind(this)
        this.emit = props.emit
    }

    chooseFile (ev) {
        console.log('choose', ev)
        var file = ev.target.files[0]
        this.setState({ selectedFile: file })
    }

    nevermind () {
        this.setState({ selectedFile:  null })
    }

    savePost (ev) {
        ev.preventDefault()
        // todo should wait for save to finish
        var text = ev.target.elements.text.value
        var image = this.state.selectedFile
        this.emit(evs.post.new, { image, text })
        this.setState({ selectedFile: null })
    }

    render (props) {
        var { emit } = props

        return <div className="new-post">
            <input type="file" accept="image/*" onChange={this.chooseFile} />
            {this.state.selectedFile ?
                <FilePreview {...this.state} emit={emit}
                    nevermind={this.nevermind}
                    savePost={this.savePost}
                /> :
                null
            }
        </div>
    }
}

// function New (props) {
//     var { emit } = props

//     return <div>
//         <input type="file" accept="image/*" onChange={emit(evs.post.new)} />
//         <FileInput />
//     </div>
// }

module.exports = New
