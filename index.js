'use strict';

var path = require('path');
var through = require('through2');
var staticModule = require('static-module');
var resolve = require('resolve');
var assign = require('object-assign');
var stringify = require('js-stringify');
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
		var render = jade.compileFile(file, opts);

		track(sm, [ file ].concat(render.dependencies));

		return stringify(render());
	}

	function render( source, opts ){
		var render = jade.compile(source, opts);

		track(sm, render.dependencies);

		return stringify(render());
	}
};

function track( sm, files ){
	files.forEach(function( file ){
		sm.emit('file', file);
	});
}
