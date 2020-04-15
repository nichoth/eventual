var { h } = require('preact')
var { extname } = require('path')
var EditableField = require('./editable-field')
var Router = require('../routes')
var evs = require('../EVENTS')

var router = Router()

function View (props) {
    console.log('render', props)
    var { emit } = props

    // for electron which starts with a file path
    var { pathname } = props.route
    if (extname(pathname) === '.html') pathname = '/'

    if (pathname) var m = router.match(pathname)
    if (m) var res = m.action(m)
    if (m) var RouteView = res.view
    if (!m) var RouteView = function NotFound (props) {
        return <div>Couldnt find that path</div>
    }

    var field = props.me.name ?
        (<EditableField
            name={props.me.name}
            onSave={emit(evs.profile.save)} />) :
        ''

    var image = props.avatarUrl ? 
        <div className="avatar-box">
            <img className={'avatar'} src={ props.avatarUrl } />
        </div> :
        null

    return <div>
        <div className="menu">
            <div className="menu-item">
                <span>Avatar: </span>
                <input type="file" accept="image/*"
                    onChange={emit(evs.profile.setAvatar)}
                />
                {image}
                {' '}
            </div>

            <div className="menu-item">
                {field}
            </div>

            <div className="menu-item">
                <a className="home-link" href="/">home</a>
            </div>

            <div className="menu-item">
                <a className="peers-link" href="/peers">peers</a>
            </div>

            <div className="menu-item">
                <a className="pubs" href="/pubs">pubs</a>
            </div>

            <a className="new-post" href="/new">+</a>
        </div>

        <hr />

        <RouteView {...props} />
    </div>
}



module.exports = View

