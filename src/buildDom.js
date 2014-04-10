var buildHtml = require('./buildHtml');
var stitchDom = require('./stitchDom');
var $ = require('jquery');

module.exports = function(mod, tpl) {
	if(!mod) throw new Error('Missing model and template');
	if(typeof tpl !== 'string') throw new Error('Missing template');

	return stitchDom(mod, tpl, $(buildHtml(mod, tpl))[0]);
};