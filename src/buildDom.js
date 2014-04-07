var buildHtml = require('./buildHtml');
var stitchDom = require('./stitchDom');
var $ = require('jquery');

module.exports = function(mod, tpl) {
	return stitchDom(mod, tpl, $(buildHtml(mod, tpl))[0]);
};