var render = $('#render');
var unbound = $('#unbound');

var data = {
	name: "Dave",
	age: 25,
	town: "London"
};
var tpl;

$.ajax({
	url: '/template.html',
	async: false,
	success: function(data) {
		tpl = data.replace(/(\r\n|\n|\r|\t)/gm,"");
	}
});

function makeTemplateFunction(tpl) {
	var tplSplit = tpl.split("{{");
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

var tplFunction = makeTemplateFunction(tpl);

render.html(tplFunction(data));

function linearTree(tpl) {
	var result = tpl.split("><");
	_.forEach(result, function(item, itemCount) {
		result[itemCount] = item = item.replace(/(<|>)/gm,"");
		item = item.split("{{");
		if(item.length > 1) {
			_.forEach(item, function(subitem, subCount) {
				subitem = subitem.split("}}");
				result[itemCount] = [item[0], ">"+subitem[0], subitem[1]];
			});
		}
	});
	result = _.flatten(result);
	return result;
}

var linTree = linearTree(tpl);
var currentNode = render.find(':first-child');
var stack = [];

function checkNodeMatch(dom, tpl) {
	var node = dom.nodeName.toLowerCase();
	if(dom.nodeName.toLowerCase() === tpl) {
		return true;
	} else {
		console.log("Node doesn't match template ("+node+" vs "+tpl+")");
		return false;
	}
}
function stepDom(next) {
	var identifier = next.charAt(0);
	switch(identifier) {
		case ">":
		break;
		case "/":
			if(currentNode.next().length) {
				currentNode = currentNode.next();
			} else {
				currentNode = currentNode.parent();
			}
		break;
		default:
			currentNode = currentNode.find(":first-child");
		break;
	}
}
function bindToModel(attribute, element) {
	console.log("Binding ", attribute, " to ", element);
}
function processNode(curr, rest) {
	if(curr) {
		var identifier = curr.charAt(0);
		switch(identifier) {
			case ">":
				bindToModel(curr.substring(1), currentNode[0]);//.childNodes[0]);
			break;
			case "/":
				stepDom(curr);
			break;
			default:
				if(checkNodeMatch(currentNode[0], curr)) {
					stepDom(rest[0]);
				}
			break;
		}
		processNode(rest.shift(), rest);
	}
};
var curr = linTree.shift();
processNode(curr, linTree);