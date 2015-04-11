'use strict';

var path = require('path');
var through = require('through2');
var staticModule = require('static-module');
var quote = require('quote-stream');
var resolve = require('resolve');
var assign = require('object-assign');
var jade = require('jade');

module.exports = transform;

function transform( file, opts ){
	if (/\.json$/.test(file))
		return through();

	if (!opts)
		opts = {};

	var vars = assign({
		__filename: file,
		__dirname: path.dirname(file),
		require: { resolve: resolver }
	}, opts.vars);

	var sm = staticModule({
		jade: {
			renderFile: renderFile,
			render: render,
		},
	}, {
		vars: vars,
		varModules: { path: path },
	});

	return sm;

	function resolver( p ){
		return resolve.sync(p, {
			basedir: path.dirname(file),
		});
	}

	function renderFile( file, opts ){
		var markup = quote();

		markup.end(jade.renderFile(file, opts));

		sm.emit('file', file);

		return markup;
	}

	function render( source, opts ){
		var markup = quote();

		markup.end(jade.render(source, opts));

		return markup;
	}
};
