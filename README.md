# brjade

A [Browserify](https://github.com/substack/node-browserify) transform to
inline the result of calls to `jade.renderFile` and `jade.render`.

Heavily inspired by [brfs](https://github.com/substack/brfs).

In a script that might or might not be browserified:

```js
var jade = require('jade');

jade.renderFile(__dirname + '/index.jade');
```

When bundling:

```js
var fs = require('fs');
var browserify = require('browserify');
var brjade = require('brjade');

browserify('index.js')
	.transform(brjade)
	.bundle()
	.pipe(fs.createWriteStream('bundle.js'));
```
