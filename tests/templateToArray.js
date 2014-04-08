var expect = require('chai').expect;
var Backbone = require('backbone');

// SUT
var templateToArray = require('../src/templateToArray');

// helpers
var result;
var processTpl = function(tpl) {
	result = templateToArray(tpl);
};

describe('TemplateToArray', function() {

	describe('when called', function() {

		it('should always return an array', function() {
			expect(templateToArray()).to.be.instanceof(Array);
		});

		describe('with no template', function() {

			it('should return an empty array', function() {
				expect(templateToArray()).to.have.property('length', 0);
			});

		});

	});

	describe('when template contains', function() {

		describe('a single element', function() {

			it('should return an array with one item', function() {
				expect(templateToArray('<div></div>')).to.have.property('length', 1);
			});

			it('should return an array containing a string identifying the element', function() {
				expect(templateToArray('<div></div>')[0]).to.equal('div');
				expect(templateToArray('<p></p>')[0]).to.equal('p');
			});

		});

		describe('two sibling elements', function() {

			beforeEach(function() {
				processTpl('<div></div><p></p>');
			});

			it('should return an array of length matching the number of elements', function() {
				expect(result.length).to.equal(2);
			});

			it('should return an array containing string identifiers for each element', function() {
				expect(result[0]).to.equal('div');
				expect(result[1]).to.equal('p');
			});

		});

		describe('one element nested inside another', function() {

			beforeEach(function() {
				processTpl('<div><p></p></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expect(result.length).to.equal(2);
			});

			it('should return an array containing string identifiers for each element', function() {
				expect(result[0]).to.equal('div');
				expect(result[1]).to.equal('p');
			});

		});

		describe('sibling nested elements', function() {

			beforeEach(function() {
				processTpl('<div><p></p></div><a><span></span></a>');
			});

			it('should return an array of length matching the number of elements', function() {
				expect(result.length).to.equal(4);
			});

			it('should return an array containing string identifiers for each element', function() {
				expect(result[0]).to.equal('div');
				expect(result[1]).to.equal('p');
				expect(result[2]).to.equal('a');
				expect(result[3]).to.equal('span');
			});

		});

		describe('self closing elements', function() {

			beforeEach(function() {
				processTpl('<input />');
			});

			it('should return an array of length matching the number of elements', function() {
				expect(result.length).to.equal(1);
			});

			it('should return an array containing a string identifier for the element', function() {
				expect(result[0]).to.equal('input');
			});

		});

		describe('sibling self closing elements', function() {

			beforeEach(function() {
				processTpl('<input /><img />');
			});

			it('should return an array of length matching the number of elements', function() {
				expect(result.length).to.equal(2);
			});

			it('should return an array containing a string identifier for the element', function() {
				expect(result[0]).to.equal('input');
				expect(result[1]).to.equal('img');
			});

		});

		describe('an element with attributes', function() {

			beforeEach(function() {
				processTpl('<div class="test"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expect(result.length).to.equal(1);
			});

			it('should return an array containing a string identifier for the element', function() {
				expect(result[0]).to.equal('div');
			});

		});

		describe('sibling elements with attributes', function() {

			beforeEach(function() {
				processTpl('<div class="test"></div><p class="anothertest"></p>');
			});

			it('should return an array of length matching the number of elements', function() {
				expect(result.length).to.equal(2);
			});

			it('should return an array containing a string identifier for the element', function() {
				expect(result[0]).to.equal('div');
				expect(result[1]).to.equal('p');
			});

		});

		describe('nested elements with attributes', function() {

			beforeEach(function() {
				processTpl('<div class="test"><p class="anothertest"></p></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expect(result.length).to.equal(2);
			});

			it('should return an array containing a string identifier for the element', function() {
				expect(result[0]).to.equal('div');
				expect(result[1]).to.equal('p');
			});

		});

	});

});