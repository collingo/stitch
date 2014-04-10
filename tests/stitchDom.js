var expect = require('chai').expect;
var sinon = require('sinon');
var Backbone = require('backbone');
var jsdom = require('jsdom').jsdom;
var jquery = require('fs').readFileSync('node_modules/jquery/dist/jquery.js', 'utf-8');
var doc = jsdom('<html><head><script>'+jquery+'</script></head><body></body></html>');
var $ = doc.createWindow().jQuery;
var proxyquire = require('proxyquire');

// SUT
var stitchDom = require('../src/stitchDom');

// helpers
var getHtml = function(dom) {
	return $('<div>').append($(dom).clone()).html();
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

	describe('when template contains an item to bind', function() {

		var stitched;
		var model;
		var tpl;
		var dom;
		var mocks;
		var templateToArraySpy;
		var modelOnSpy;
		var templateToArrayResponse = ['div', '>test'];

		beforeEach(function() {
			model = new Backbone.Model({
				test: 'BindMe'
			});
			tpl = '<div>{{test}}</div>';
			dom = $('<div>BindMe</div>')[0];

			mocks = {
				templateToArray: function() {
					return templateToArrayResponse;
				}
			};
			templateToArraySpy = sinon.spy(mocks, 'templateToArray');
			modelOnSpy = sinon.spy(model, 'on');
			stitchDom = proxyquire('../src/stitchDom', {
				'./templateToArray': mocks.templateToArray
			});
			stitched = stitchDom(model, tpl, dom);
		});

		it('should return the original dom', function() {
			expect(stitched).to.equal(dom);
		});

		it('should return the original dom with unchanged html', function() {
			expect(getHtml(stitched)).to.equal('<div>BindMe</div>');
		});

		it('should call the templateToArray dependency once', function() {
			expect(templateToArraySpy.callCount).to.equal(1);
		});

		it('should call the templateToArray dependency with template', function() {
			expect(templateToArraySpy.getCall(0).args[0]).to.equal(tpl);
		});

		it('should call the "on" method of model once', function() {
			expect(modelOnSpy.callCount).to.equal(1);
		});

		it('should bind the item to the model', function() {
			model.set('test', 'Changed');
			expect(getHtml(stitched)).to.equal('<div>Changed</div>');
		});

	});

});
