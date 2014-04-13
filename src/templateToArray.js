module.exports = function templateToArray(tpl) {
	if(!tpl) return [];

	var match = tpl.match(/<[a-z]+[^>]*>|\{\{[a-zA-Z]+\}\}/g);
	var i, tag, tags = [];
	for (i = 0; i < match.length; i++) {
		tag = getTag(match[i]);
		tag.attributes = getAttributesHash(match[i]);
		tags[i] = tag;
	}

	function getTag(tagString) {
		var match = tagString.match(/^<([a-z]+)/);
		var tag = {};
		if(match && match.length > 1) {
			tag.type = match[1];
		} else {
			tag.type = '>';
			tag.bind = tagString.match(/^\{\{([a-zA-Z]+)\}\}/)[1];
		}
		return tag;
	}

	function getAttributesHash(tagString) {
		var hash = {};
		var match = tagString.match(/([a-z]+\=\"[^\"]*\")/g);
		var attr;
		if(match) {
			for(var i = 0; i < match.length; i++) {
				attr = match[i].split('=');
				hash[attr[0]] = attr[1].match(/^[\"]*([\{\}a-zA-Z ]+)/)[1];
			}
		}
		return hash;
	}

	return tags;
};