module.exports = function templateToArray(tpl) {
	if(!tpl) return [];

	var tags = tpl.match(/<[a-z]+[^<]*>|\{\{[a-z]+\}\}/g);
	var i, match;
	for (i = 0; i < tags.length; i++) {
		match = tags[i].match(/^<([a-z]+)/);
		if(match && match.length > 1) {
			tags[i] = match[1];
		} else {
			tags[i] = '>' + tags[i].match(/^\{\{([a-z]+)\}\}/)[1];
		}
	}

	return tags;
};