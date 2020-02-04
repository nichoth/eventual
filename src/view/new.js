var { h } = require('preact')
var evs = require('../EVENTS')

function New (props) {
    return <div>
        create new stuff
        <button onClick={props.emit(evs.post.new)}>new</button>
    </div>
}

module.exports = New

