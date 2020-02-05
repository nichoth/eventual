var { h } = require('preact')

function Home (props) {
    if (!props.posts) return <div>home</div>

    console.log('props', props)
    return <div className="posts">
        posts
    </div>
}

module.exports = Home

