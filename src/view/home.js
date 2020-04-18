var { h } = require('preact')
// var App = require('../app')

function Home (props) {
    if (!props.posts) return <div>home</div>

    return <div className="posts">
        <ul className="post-list">
            {props.posts.map(function (post) {
                if (!post.value.content.mentions) return null

                var hash = post.value.content.mentions[0] ?
                    post.value.content.mentions[0].link :
                    null

                var { author } = post.value

                if (!hash) return null

                return <li className="post">
                    {post.value.content.mentions ?
                        <img src={props.postUrls[hash]} /> :
                        null}
                    <br />
                    <div className="post-text">
                        {post.value.content.text}
                    </div>
                    <div className="author">
                        {author}
                    </div>
                </li>
            })}
        </ul>
    </div>
}

module.exports = Home

