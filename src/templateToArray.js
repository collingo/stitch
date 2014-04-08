module.exports = function templateToArray(tpl) {
	if(!tpl) return [];

	var startTags = tpl.match(/<[a-z]+[^<]*>/g);
	for (var i = 0; i < startTags.length; i++) {
		startTags[i] = startTags[i].match(/^<([a-z]+)/)[1];
	}

	return startTags;
};