var expect = require('chai').expect;
var sinon = require('sinon');
var Backbone = require('backbone');
var jsdom = require('jsdom').jsdom;
var jquery = require('fs').readFileSync('node_modules/jquery/dist/jquery.js', 'utf-8');
var doc = jsdom('<html><head><script>'+jquery+'</script></head><body></body></html>');
var $ = doc.createWindow().jQuery;
var proxyquire =  require('proxyquire');

// SUT
var stitch = require('../src/stitch');

describe('Stitch', function() {

	describe('when called without parameters', function() {

		it('should throw an error with message', function() {
			expect(function() {
				stitch();
			}).to.throw(Error, /Missing model and template/);
		});

	});

	describe('when missing tpl parameter', function() {

		it('should throw an error with message', function() {
			expect(function() {
				stitch({});
			}).to.throw(Error, /Missing template/);
		});

	});

	describe('when run on client and passed a model and template', function() {

		var mod;
		var tpl;
		var dom;
		var mocks;
		var buildHtmlResponse = '<div>BindMe</div>';
		var stitchDomResponse = '<div>Bound</div>';

		beforeEach(function() {
			mod = new Backbone.Model({
				test: "BindMe"
			});
			tpl = '<div>{{test}}</div>';

			mocks = {
				buildHtml: function() {
					return buildHtmlResponse;
				},
				stitchDom: function() {
					return stitchDomResponse;
				}
			};
			buildHtmlSpy = sinon.spy(mocks, 'buildHtml');
			stitchDomSpy = sinon.spy(mocks, 'stitchDom');
			buildDom = proxyquire('../src/buildDom', {
				'jquery': $,
				'./buildHtml': mocks.buildHtml,
				'./stitchDom': mocks.stitchDom
			});
			dom = buildDom(mod, tpl);
		});

		it('should call buildHtml dependency once', function() {
			expect(buildHtmlSpy.calledOnce).to.equal(true);
		});

		// it('should call buildHtml dependency with two arguments', function() {
		// 	expect(buildHtmlSpy.getCall(0).args.length).to.equal(2);
		// });

		// it('should call buildHtml dependency with model', function() {
		// 	expect(buildHtmlSpy.getCall(0).args[0]).to.equal(mod);
		// });

		// it('should call buildHtml dependency with template', function() {
		// 	expect(buildHtmlSpy.getCall(0).args[1]).to.equal(tpl);
		// });

		// it('should call stitchDom dependency once', function() {
		// 	expect(stitchDomSpy.calledOnce).to.equal(true);
		// });

		// it('should call stitchDom dependency with three arguments', function() {
		// 	expect(stitchDomSpy.getCall(0).args.length).to.equal(3);
		// });

		// it('should call stitchDom dependency with model', function() {
		// 	expect(stitchDomSpy.getCall(0).args[0]).to.equal(mod);
		// });

		// it('should call stitchDom dependency with template', function() {
		// 	expect(stitchDomSpy.getCall(0).args[1]).to.equal(tpl);
		// });

		// it('should call stitchDom dependency with dom', function() {
		// 	expect(!!stitchDomSpy.getCall(0).args[2].nodeName).to.equal(true);
		// });

		// it('should call stitchDom dependency with dom made from the output of buildHtml', function() {
		// 	var actualDom = stitchDomSpy.getCall(0).args[2];
		// 	expect($('<div>').append($(actualDom).clone()).html()).to.equal(buildHtmlResponse);
		// });

		// it('should return the result of stitchDom', function() {
		// 	expect(dom).to.equal(stitchDomResponse);
		// });

	});

});
