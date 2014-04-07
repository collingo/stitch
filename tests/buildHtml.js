var expect = require('chai').expect;
var Backbone = require('backbone');

// SUT
var buildHtml = require('../src/buildHtml');

// helpers
var getHtml = function(data, tpl) {
	return buildHtml(new Backbone.Model(data), tpl);
};

describe('BuildHtml', function() {

	describe('when called correctly with', function() {

		describe('a simple Backbone model and string template', function() {

			it('should return the original template', function(){
				var html = getHtml({
					test: 'Hello'
				}, '<div></div>');
				expect(html).to.equal('<div></div>');
			});

		});

		describe('an empty Backbone model', function() {

			it('should return a the original template string', function(){
				var html = getHtml({}, '<div>{{test}}</div>');
				expect(html).to.equal('<div>{{test}}</div>');
			});

		});

		describe('a mismatching Backbone model', function() {

			it('should return the string with only matching placeholders replaced', function(){
				var html = getHtml({
					match: 'matched',
					mismatch: 'not matched'
				}, '<div><div>{{match}}</div><div>{{matchAgain}}</div></div>');
				expect(html).to.equal('<div><div>matched</div><div>{{matchAgain}}</div></div>');
			});

		});

		describe('a template containing whitespace characters', function() {

			it('should return the populated template', function(){
				var html = getHtml({
					one: 'ONE',
					two: 'TWO'
				}, '<div>\n\t<p>{{one}}<span>{{two}}</span></p>\n\t<input type="text" />\n</div>');
				expect(html).to.equal('<div>\n\t<p>ONE<span>TWO</span></p>\n\t<input type="text" />\n</div>');
			});

		});

	});

	describe('when called in error with', function() {

		describe('no parameters', function() {

			it('should throw an error with message', function() {
				expect(buildHtml).to.throw(Error, /Missing model and template/);
			});

		});

		describe('a plain object for the model', function() {

			it('should throw an error with message', function() {
				expect(function() {
					buildHtml({}, "<div></div>");
				}).to.throw(Error, /Model must be a Backbone Model/);
			});

		});

		describe('no template', function() {

			it('should throw an error with message', function() {
				expect(function() {
					buildHtml(new Backbone.Model({}));
				}).to.throw(Error, /Missing template/);
			});

		});

		describe('a non-string template', function() {

			it('should throw an error with message', function() {
				expect(function() {
					buildHtml(new Backbone.Model({}), 123);
				}).to.throw(Error, /Template must be a string/);
			});

		});

	});

	describe('when the template has', function() {

		describe('an attribute to match', function() {

			it('should return the populated template', function(){
				var html = getHtml({
					test: 'Hello'
				}, '<div>{{test}}</div>');
				expect(html).to.equal('<div>Hello</div>');
			});

		});

		describe('multiple attributes to match', function() {

			it('should return the populated template', function(){
				var html = getHtml({
					one: 'ONE',
					two: 'TWO'
				}, '<div><p>{{one}}<span>{{two}}</span></p></div>');
				expect(html).to.equal('<div><p>ONE<span>TWO</span></p></div>');
			});

		});

		describe('a self closing element (input)', function() {

			it('should return the populated template', function(){
				var html = getHtml({
					one: 'ONE',
					two: 'TWO'
				}, '<div><p>{{one}}<span>{{two}}</span></p><input type="text" /></div>');
				expect(html).to.equal('<div><p>ONE<span>TWO</span></p><input type="text" /></div>');
			});

		});

	});

});