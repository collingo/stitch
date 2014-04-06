(function() {

	var html = function(mod, tpl) {

		function templateFunction(tpl) {
			var tplSplit = tpl.replace(/(\r\n|\n|\r|\t)/gm,"").split("{{");
			var map = {};
			_.forEach(tplSplit, function(item, i) {
				item = item.split("}}");
				if(item.length > 1) {
					map[item[0]] = i + Object.keys(map).length;
					tplSplit[i] = ['{{'+item[0]+'}}', item[1]];
				}
			});
			tplSplit = _.flatten(tplSplit);
			return function(tpl, map) {
				return function(data) {
					_.forEach(data, function(attr, key) {
						tpl[map[key]] = data[key];
					});
					return tpl.join("");
				}
			}(tplSplit, map);
		}

		return templateFunction(tpl)(mod.toJSON());
	};

	var stitch = function(mod, tpl, dom) {

		var nodeWalkCount = 0;
		var tplArray = linearTree(tpl);

		function linearTree(tpl) {
			var result = tpl.replace(/(\r\n|\n|\r|\t)/gm,"").replace(/\{\{/gm,"{{>").split("{{");
			if(result.length > 1) {
				_.forEach(result, function(item, count) {
					item = item.split("}}");
					if(item.length > 1) {
						result[count] = [item[0], item[1]];
					} else {
						result[count] = item[0];
					}
				});
			}
			result = _.flatten(result);
			_.forEach(result, function(item, count) {
				if(item.charAt(0) !== ">") {
					result[count] = sub = item.split("><");
					_.forEach(sub, function(subItem, subCount) {
						subItem = subItem.replace(/(<|>)/gm,"");
						if(subItem.charAt(0) === "/") {
							result[count][subCount] = undefined;
						} else {
							result[count][subCount] = subItem.split(" ")[0];
						}
					});
				}
			});
			result = _.compact(_.flatten(result));
			return result;
		}

		function walkTheDOM(node, func) {
			func(node);
			node = node.firstChild;
			while (node) {
				walkTheDOM(node, func)
				node = node.nextSibling;
			}
		}

		function bindData(node, attr) {
			mod.on('change:'+attr, function(mod) {
				node.data = mod.get(attr);
			});
		}

		walkTheDOM($(dom)[0], function(node) {
			if(!(node.nodeName === "#text" && node.data.charAt(0) === "\n")) {
				var expected = tplArray[nodeWalkCount];
				if(expected.charAt(0) === ">") {
					bindData(node, expected.substring(1));
				} else {
					if(node.nodeName.toLowerCase() !== expected) {
						console.log("No match:", node.nodeName.toLowerCase(), expected);
					}
				}
				nodeWalkCount++;
			}
		});

		return dom;
	};

	var dom = function(mod, tpl) {
		return stitch(mod, tpl, $(html(mod, tpl))[0]);
	};

	window.T = {
		html: function() {
			return html.apply(this, arguments);
		},
		stitch: function() {
			return stitch.apply(this, arguments);
		},
		dom: function() {
			return dom.apply(this, arguments);
		}
	};
}());