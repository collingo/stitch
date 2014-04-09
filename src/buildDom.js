var buildHtml = require('./buildHtml');
var stitchDom = require('./stitchDom');
var $ = require('jquery');

module.exports = function(mod, tpl, domBuilder) {
	if(!mod) throw new Error('Missing model, template and domBuilder');
	if(typeof tpl !== 'string') throw new Error('Missing template and domBuilder');
	if(!domBuilder) throw new Error('Missing domBuilder');

	return stitchDom(mod, tpl, domBuilder(buildHtml(mod, tpl))[0]);
};