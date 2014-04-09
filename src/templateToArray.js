module.exports = function templateToArray(tpl) {
	if(!tpl) return [];

	var tags = tpl.match(/<[a-z]+[^<]*>/g);
	for (var i = 0; i < tags.length; i++) {
		tags[i] = tags[i].match(/^<([a-z]+)/)[1];
	}

	return tags;
};