var expect = require('chai').expect;
var Backbone = require('backbone');

// SUT
var templateToArray = require('../src/templateToArray');

describe('TemplateToArray', function() {

	var result;

	describe('when called', function() {

		it('should always return an array', function() {
			expect(templateToArray()).to.be.instanceof(Array);
		});

	});

	describe('when called with no template', function() {

		it('should return an empty array', function() {
			expect(templateToArray()).to.have.property('length', 0);
		});

	});

	describe('when template is a single element', function() {

		it('should return an array with one item', function() {
			expect(templateToArray('<div></div>')).to.have.property('length', 1);
		});

		it('should return an array containing a string identifying the element', function() {
			expect(templateToArray('<div></div>')[0]).to.equal('div');
			expect(templateToArray('<p></p>')[0]).to.equal('p');
		});

	});

	describe('when template contains two sibling elements', function() {

		beforeEach(function() {
			result = templateToArray('<div></div><p></p>');
		});

		it('should return an array of length matching the number of elements', function() {
			expect(result.length).to.equal(2);
		});

		it('should return an array containing string identifiers for each element', function() {
			expect(result[0]).to.equal('div');
			expect(result[1]).to.equal('p');
		});

	});

	describe('when template contains one element nested inside another', function() {

		beforeEach(function() {
			result = templateToArray('<div><p></p></div>');
		});

		it('should return an array of length matching the number of elements', function() {
			expect(result.length).to.equal(2);
		});

		it('should return an array containing string identifiers for each element', function() {
			expect(result[0]).to.equal('div');
			expect(result[1]).to.equal('p');
		});

	});

	describe('when template contains self closing elements', function() {

		beforeEach(function() {
			result = templateToArray('<input />');
		});

		it('should return an array of length matching the number of elements', function() {
			expect(result.length).to.equal(1);
		});

		it('should return an array containing a string identifier for the element', function() {
			expect(result[0]).to.equal('input');
		});

	});

	describe('when template contains sibling self closing elements', function() {

		beforeEach(function() {
			result = templateToArray('<input /><input />');
		});

		it('should return an array of length matching the number of elements', function() {
			expect(result.length).to.equal(2);
		});

		it('should return an array containing a string identifier for the element', function() {
			expect(result[0]).to.equal('input');
			expect(result[1]).to.equal('input');
		});

	});

	// describe('when template contains element with attributes', function() {

	// 	beforeEach(function() {
	// 		result = templateToArray('<div class="test"></div>');
	// 		console.log(result);
	// 	});

	// 	it('should return an array of length matching the number of elements', function() {
	// 		expect(result.length).to.equal(1);
	// 	});

	// 	it('should return an array containing a string identifier for the element', function() {
	// 		expect(result[0]).to.equal('input');
	// 		expect(result[1]).to.equal('input');
	// 	});

	// });

});