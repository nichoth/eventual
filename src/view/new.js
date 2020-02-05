var { h } = require('preact')
var evs = require('../EVENTS')

function New (props) {
    var { emit } = props

    return <div>
        <span>create new stuff</span>
        <input type="file" accept="image/*"
            onChange={emit(evs.post.new)}
        />
    </div>
}

module.exports = New

