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

	describe('when called without parameters', function() {

		it('should throw an error with message', function() {
			expect(function() {
				stitchDom();
			}).to.throw(Error, /Missing model, template and dom/);
		});

	});

	describe('when missing tpl parameter', function() {

		it('should throw an error with message', function() {
			expect(function() {
				stitchDom({});
			}).to.throw(Error, /Missing template and dom/);
		});

	});

	describe('when missing dom parameter', function() {

		it('should throw an error with message', function() {
			expect(function() {
				stitchDom({}, '');
			}).to.throw(Error, /Missing dom/);
		});

	});

	// describe('when single item to bind', function() {

	// 	it('should return the original dom', function() {
	// 		var dom = $('<div>{{test}}</div>')[0];
	// 		var stitched = runStitch({}, "<div>{{test}}</div>", dom);
	// 		expect(stitched).to.equal(dom);
	// 	});

	// });

});
