var { h } = require('preact')
var EditableField = require('./editable-field')
var Router = require('../routes')
var evs = require('../EVENTS')

function View (props) {
    var { emit } = props
    var router = Router()
    if (props.route.pathname) var m = router.match(props.route.pathname)
    if (m) var RouteView = m.action(m)
    if (!m) var RouteView = function NotFound (props) {
        return <div>Couldnt find that path</div>
    }

    var field = props.me.name ?
        (<EditableField
            name={props.me.name}
            onSave={emit(evs.profile.save)} />) :
        ''

    // me.image is avatar
    return <div>
        <div className="menu">
            <input type="file" accept="image/*"
                onChange={emit(evs.profile.setAvatar)}
            />
            <img className={props.me.image ? 'avatar' : 'no-avatar'} />
            {field}
            <a className="new-post" href="/new">+</a>
        </div>

        <hr />
        <RouteView {...props} />
        <button onClick={emit(evs.hello.world)}>emit event</button>
    </div>
}



module.exports = View

