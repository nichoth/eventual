Creating the desktop installer (dmg file) is called packaging. This is what `electron-builder` does. 

The cli option `-c.snap.publish=github` forces publishing snap not to Snap Store, but to GitHub. I guess `snap` must be a format like `dmg`.

Releases are based on Git tags.


