module.exports = function templateToArray(tpl) {
	if(!tpl) return [];

	var search = tpl.match(/<[a-z]+[^<]*>|\{\{[a-zA-Z]+\}\}/g);
	var i, tag, tags = [];
	for (i = 0; i < search.length; i++) {
		tag = getTag(search[i]);
		tag.attributes = getAttributesHash(search[i]);
		tags[i] = tag;
	}

	function getTag(tagString) {
		var match = tagString.match(/^<([a-z]+)/);
		var tag;
		if(match && match.length > 1) {
			tag = {
				type: match[1]
			};
		} else {
			tag = {
				type: '>',
				bind: tagString.match(/^\{\{([a-zA-Z]+)\}\}/)[1]
			};
		}
		return tag;
	}

	function getAttributesHash(tagString) {
		var attributes = {};
		var attrs = tagString.match(/\s([\"\'\=a-z]+[^>]*)/);
		var attr;
		if(attrs) {
			attrs = attrs[1].split(' ');
			for(var i = 0; i < attrs.length; i++) {
				attr = attrs[i].split('=');
				attributes[attr[0]] = attr[1].match(/^[\'\"]*([a-zA-Z]+)/)[1];
			}
		}
		return attributes;
	}

	return tags;
};