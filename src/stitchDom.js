var templateToArray = require('./templateToArray');

module.exports = function(mod, tpl, dom) {
	if(!mod) throw new Error("Missing model, template and dom");
	if(typeof tpl !== 'string') throw new Error("Missing template and dom");
	if(!dom) throw new Error("Missing dom");

	var nodeWalkCount = 0;

	var tplArray = templateToArray(tpl);

	function walkTheDOM(node, func) {
		func(node);
		node = node.firstChild;
		while (node) {
			walkTheDOM(node, func);
			node = node.nextSibling;
		}
	}

	function bindData(node, attr) {
		mod.on('change:'+attr, function(mod) {
			node.data = mod.get(attr);
		});
	}

	walkTheDOM(dom, function(node) {
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