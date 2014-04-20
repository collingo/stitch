module.exports = function(mod, tpl) {
	if(!arguments.length) throw new Error("Missing model and template");
	if(typeof mod !== 'object') throw new Error("Model must be plain object"); 
	if(!tpl) throw new Error("Missing template");
	if(typeof tpl !== 'string') throw new Error("Template must be a string");

	var templateFunction = (function() {
		var rc = {
			'\n': '\\n',
			'\"': '\\\"',
			'\u2028': '\\u2028',
			'\u2029': '\\u2029'
		};
		var getNested = function(location) {
			var locationArr = location.split('.');
			var result = 'o';
			for (var i = 0; i < locationArr.length; i++) {
				result += '["' + locationArr[i] + '"]';
			}
			return result;
		};
		return function makeTemplateFunction(str) {
			return new Function(
				'o',
				'return "' + (
					str
					.replace(/["\n\r\u2028\u2029]/g, function($0) {
						return rc[$0];
					})
					.replace(/\{\{([a-zA-Z\.]+?)\}\}/g, function() {
						var getter = getNested(arguments[1]);
						return '" + (' + getter + ' ? ' + getter + ' : "{{' + arguments[1] + '}}") + "';
					})
				) + '";'
			);
		};
	}());

	return templateFunction(tpl)(mod);
};