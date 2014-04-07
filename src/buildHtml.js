module.exports = function(mod, tpl) {

	var templateFunction = (function() {
		var rc = {
			'\n': '\\n', '\"': '\\\"',
			'\u2028': '\\u2028', '\u2029': '\\u2029'
		};
		return function makeTemplateFunction(str) {
			return new Function(
			  	'o',
			  	'return "' + (
					str
					.replace(/["\n\r\u2028\u2029]/g, function($0) {
				  		return rc[$0];
					})
					.replace(/\{\{([\s\S]+?)\}\}/g, '" + o["$1"] + "')
				) + '";'
			);
		};
	}());

	return templateFunction(tpl)(mod.toJSON());
};