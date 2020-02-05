var { h } = require('preact')

function Home (props) {
    if (!props.posts) return <div>home</div>

    console.log('props', props)
    return <div className="posts">
        posts
        <ul className="post-list">
            {props.posts.map(function (post) {
                return <li className="post">{post.value.content.text}</li>
            })}
        </ul>
    </div>
}

module.exports = Home

