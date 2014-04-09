var expect = require('chai').expect;
var sinon = require('sinon');
var Backbone = require('backbone');
var jsdom = require('jsdom').jsdom;
var jquery = require('fs').readFileSync('node_modules/jquery/dist/jquery.js', 'utf-8');
var doc = jsdom('<html><head><script>'+jquery+'</script></head><body></body></html>');
var $ = doc.createWindow().jQuery;

// SUT
var buildDom = require('../src/buildDom');

describe('StitchDom', function() {

	describe('when called without parameters', function() {

		it('should throw an error with message', function() {
			expect(function() {
				buildDom();
			}).to.throw(Error, /Missing model, template and domBuilder/);
		});

	});

	describe('when missing tpl and domBuilder parameters', function() {

		it('should throw an error with message', function() {
			expect(function() {
				buildDom({});
			}).to.throw(Error, /Missing template and domBuilder/);
		});

	});

	describe('when missing domBuilder parameter', function() {

		it('should throw an error with message', function() {
			expect(function() {
				buildDom({}, '');
			}).to.throw(Error, /Missing domBuilder/);
		});

	});

	describe('when passed a model and template', function() {

		var mod;
		var tpl;
		var dom;

		beforeEach(function() {
			mod = new Backbone.Model({
				test: "BindMe"
			});
			tpl = '<div>{{test}}</div>';
			dom = buildDom(mod, tpl, $);
		});

		it('should return dom', function() {
			expect(!!dom.nodeName).to.equal(true);
		});

		it('should return bound dom', function() {
			mod.set({
				test: "Changed"
			});
			expect($('<div>').append($(dom).clone()).html()).to.equal('<div>Changed</div>');
		});

	});

});
