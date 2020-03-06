var { h } = require('preact')
var App = require('../app')

function Home (props) {
    if (!props.posts) return <div>home</div>

    console.log('props', props)
    return <div className="posts">
        posts
        <ul className="post-list">
            {props.posts.map(function (post) {
                if (!post.value.content.mentions) return null

                var hash = post.value.content.mentions[0] ?
                    post.value.content.mentions[0].link :
                    null
                return <li className="post">
                    {post.value.content.text}
                    {post.value.content.mentions && props.postUrls ?
                        <img src={props.postUrls[hash]} /> :
                        null}
                </li>
            })}
        </ul>
    </div>
}

module.exports = Home

