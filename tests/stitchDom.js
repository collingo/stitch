var expect = require('chai').expect;
var sinon = require('sinon');
var Backbone = require('backbone');
var jsdom = require('jsdom').jsdom;
var jquery = require('fs').readFileSync('node_modules/jquery/dist/jquery.js', 'utf-8');
var doc = jsdom('<html><head><script>'+jquery+'</script></head><body></body></html>');
var $ = doc.createWindow().jQuery;

// SUT
var stitchDom = require('../src/stitchDom');

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

	describe('when template contains an item to bind', function() {

		var stitched;
		var model;
		var tpl;
		var dom;

		beforeEach(function() {
			model = new Backbone.Model({
				test: 'BindMe'
			});
			tpl = '<div>{{test}}</div>';
			dom = $('<div>BindMe</div>')[0];
		});

		it('should return the original dom', function() {
			stitched = stitchDom(model, tpl, dom);
			expect(stitched).to.equal(dom);
		});

		it('should return the original dom with the same html', function() {
			stitched = stitchDom(model, tpl, dom);
			expect($('<div>').append($(stitched).clone()).html()).to.equal('<div>BindMe</div>');
		});

		it('should call the "on" method of model once', function() {
			var spiedOn = sinon.spy(model, 'on');
			stitched = stitchDom(model, tpl, dom);
			expect(spiedOn.callCount).to.equal(1);
		});

		it('should bind the item to the model', function() {
			stitched = stitchDom(model, tpl, dom);
			model.set('test', 'Changed');
			expect($('<div>').append($(stitched).clone()).html()).to.equal('<div>Changed</div>');
		});

	});

});
