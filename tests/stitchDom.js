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

	describe('when dom does not match the template', function() {

		it('should throw an error highlighting the mismatching elements', function() {
			expect(function() {
				stitchDom(new Backbone.Model(), '<div>{{test}}</div>', $('<p>{{test}}</p>')[0]);
			}).to.throw(Error, /Node does not match template, got <p> expecting <div>/);
			expect(function() {
				stitchDom(new Backbone.Model(), '<span>{{test}}</span>', $('<a>{{test}}</a>')[0]);
			}).to.throw(Error, /Node does not match template, got <a> expecting <span>/);
		});

	});

	describe('when template contains an item to bind', function() {

		var stitched;
		var mod;
		var tpl;
		var dom;
		var mocks;
		var templateToArraySpy;
		var modelOnSpy;
		var templateToArrayResponse = [{
			type: 'div'
		}, {
			type: '>',
			bind: 'test'
		}];

		beforeEach(function() {
			mod = new Backbone.Model({
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
			modelOnSpy = sinon.spy(mod, 'on');
			modelGetSpy = sinon.spy(mod, 'get');
			stitchDom = proxyquire('../src/stitchDom', {
				'./templateToArray': mocks.templateToArray
			});
			stitched = stitchDom(mod, tpl, dom);
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

		describe('when the model change event is bound', function() {

			it('should call the "on" method of model the correct number of times', function() {
				expect(modelOnSpy.callCount).to.equal(1);
			});

			it('should call the "on" method of model with correct event', function() {
				expect(modelOnSpy.getCall(0).args[0]).to.equal('change:test');
			});

			it('should call the "on" method of model with a callback function', function() {
				var callback = modelOnSpy.getCall(0).args[1];
				expect(typeof callback).to.equal('function');
			});

			describe('the callback', function() {

				var callback;

				beforeEach(function() {
					mod.set({
						'test': 'Cabbage'
					});
				});

				it('should fetch the data from the model', function() {
					expect(modelGetSpy.callCount).to.equal(1);
				});

				it('should fetch the correct attribute from the model', function() {
					expect(modelGetSpy.getCall(0).args[0]).to.equal('test');
				});

				it('should alter the dom correctly', function() {
					expect(getHtml(stitched)).to.equal('<div>Cabbage</div>');
				});

			});

		});

	});

});
