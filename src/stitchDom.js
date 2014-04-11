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

	function bindData(mod, attr, node) {
		mod.on('change:'+attr, function() {
			node.data = mod.get(attr);
		});
	}

	walkTheDOM(dom, function(node) {
		if(!(node.nodeName === "#text" && node.data.charAt(0) === "\n")) {
			var expected = tplArray[nodeWalkCount];
			if(expected.type === ">") {
				bindData(mod, expected.bind, node);
			} else {
				if(node.nodeName.toLowerCase() !== expected.type) {
					throw new Error('Node does not match template, got <' + node.nodeName.toLowerCase() + '> expecting <' + expected.type + '>', node.nodeName.toLowerCase(), expected);
				}
			}
			nodeWalkCount++;
		}
	});

	return dom;
};