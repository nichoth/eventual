[![Awesome Humane Tech](https://raw.githubusercontent.com/humanetech-community/awesome-humane-tech/main/humane-tech-badge.svg?sanitize=true)](https://github.com/humanetech-community/awesome-humane-tech)

# eventual gram

ssb-based photo sharing


## notes
-------------------

```
var inv = 'us-west.ssbpeer.net:8008:@MauI+NQ1dOg4Eo5NPs4OKxVQgWXMjlp5pjQ87CdRJtQ=.ed25519~F6cXW6IMaLPZXNNHTAq9UL70lc1w5qfFdQybHTWTwko='
```

### tron
Creating the desktop installer (dmg file) is called packaging. This is what `electron-builder` does. 

The cli option `-c.snap.publish=github` forces publishing snap not to Snap Store, but to GitHub. I guess `snap` must be a format like `dmg`.

* Can use github actions to automatically build & release electron app
* There is a folder for github actions -- `.github/workflows/`

#### workflows
Each YAML-file inside your .github/workflows-directory constitutes one workflow. Each workflow can contain several so-called jobs. Workflows are combinations of GH actions. Actions are the smallest portable building block of a workflow. You can create workflows using actions defined in your repository. You can create a workflow file configured to run on specific events. To use an action in a workflow, you must include it as a step. The workflow file lives in the root of your GitHub repository in the `.github/workflows` directory.


----------------------------------------


`index.js` is where things start. We call the fns defined in `app.js`.

`start.js` is where we connect the view renderer & app

`start` starts the app, `client` make an rpc connection to sbot.

Keep start & client as is, but subscription should be called in `index`. Rename `start` to `start-app` or something. `app` should be used only in subscription file, `app` should be the only one that uses `sbot` b/c that way we can swap it out with a different backend that has the same API.

index ->calls-> start

-----------------------------------------

todo
* `subscribe` should not depend on sbot, just our own api. that way you can swap out different backends

```js
var app = App(state, 3box)
var app = App(state, sbot)
var app = App(state, textile)
subscribe({ app, view, state })
```

----------------------------------------------------

