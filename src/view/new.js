var { h, Component } = require('preact')
var evs = require('../EVENTS')

function FilePreview (props) {
    var { emit, selectedFile } = props

    return <div className="file-preview">
        <div className="image">
            <img src={URL.createObjectURL(selectedFile)} />
        </div>

        <div className="controls">
            <button onClick={function (ev) {
                ev.preventDefault()
                props.nevermind()
            }}>nevermind</button>

            <button onClick={function (ev) {
                ev.preventDefault()
                emit(evs.post.new, selectedFile)
            }}>save</button>
        </div>
    </div>
}

class New extends Component {
    constructor () {
        super()
        this.nevermind = this.nevermind.bind(this)
        this.state = {
            selectedFile: null
        }

        this.chooseFile = this.chooseFile.bind(this)
    }

    chooseFile (ev) {
        console.log('choose', ev)
        var file = ev.target.files[0]

        // image.src = URL.createObjectURL(file);

        this.setState({
            selectedFile: file
        })
    }

    nevermind () {
        this.setState({ selectedFile:  null })
    }

    render (props) {
        var { emit } = props

        return <div className="new-post">
            <input type="file" accept="image/*" onChange={this.chooseFile} />
            {this.state.selectedFile ?
                <FilePreview {...this.state} emit={emit}
                    nevermind={this.nevermind}
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
