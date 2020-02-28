var { h } = require('preact')

function Err (props) {
    return <div className="error">
        {props.message}
    </div>
}

module.exports = Err
