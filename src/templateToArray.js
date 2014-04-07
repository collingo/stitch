var _ = require('lodash');

module.exports = (function() {

	var nodeWalkCount = 0;

	function templateToArray(tpl) {
		if(!tpl) return [];

		var result = tpl.match(/<([a-z]*?)[\s\/]*>/g);
		_.forEach(result, function(item, index) {
			result[index] = item.match(/^<([a-z]+)/)[1];
		});

		return result;

		// var result = tpl.replace(/(\r\n|\n|\r|\t)/gm,"").replace(/\{\{/gm,"{{>").split("{{");
		// if(result.length > 1) {
		// 	_.forEach(result, function(item, count) {
		// 		item = item.split("}}");
		// 		if(item.length > 1) {
		// 			result[count] = [item[0], item[1]];
		// 		} else {
		// 			result[count] = item[0];
		// 		}
		// 	});
		// }
		// result = _.flatten(result);
		// _.forEach(result, function(item, count) {
		// 	if(item.charAt(0) !== ">") {
		// 		result[count] = sub = item.split("><");
		// 		_.forEach(sub, function(subItem, subCount) {
		// 			subItem = subItem.replace(/(<|>)/gm,"");
		// 			if(subItem.charAt(0) === "/") {
		// 				result[count][subCount] = undefined;
		// 			} else {
		// 				result[count][subCount] = subItem.split(" ")[0];
		// 			}
		// 		});
		// 	}
		// });
		// result = _.compact(_.flatten(result));
		// return result;
	}

	return templateToArray;

}());