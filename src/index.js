var $ = require('jquery');
var Model = require('backbone').Model;
var stitch = require('./stitch');

window.stitch = stitch;

window.render = $('#render');
window.unbound = $('#unbound');

window.model = new Model({
	text: "hello",
	childCount: 9
});
window.person = new Model({
	name: "Dave",
	age: 25
});
window.personTpl = "<div><p>{{name}}</p><p>{{age}}</p></div>";

$.ajax({
	url: '/template.html',
	async: false,
	success: function(data) {
		window.tpl = data;
	}
});