var expect = require('chai').expect;
var Backbone = require('backbone');
var fs = require('fs');
var jsdom = require('jsdom').jsdom;
var jquery = fs.readFileSync('node_modules/jquery/dist/jquery.js', 'utf-8');
var doc = jsdom('<html><head><script>'+jquery+'</script></head><body></body></html>');
var $ = doc.createWindow().jQuery;

// SUT
var stitchDom = require('../src/stitchDom');

// helpers
var runStitch = function(data, tpl, dom) {
	return stitchDom(new Backbone.Model(data), tpl, dom);
};

describe('StitchDom', function() {

	describe('when instantiated', function() {

		it('should return true', function() {
			var dom = runStitch({}, "<div></div>", $('<div></div>')[0]);
			expect(dom.nodeName).to.equal("DIV");
		});

	});

});
