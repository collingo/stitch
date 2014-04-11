var expect = require('chai').expect;

// SUT
var templateToArray = require('../src/templateToArray');

// helpers
var result;
var processTpl = function(tpl) {
	result = templateToArray(tpl);
};
var expectLength = function(length) {
	expect(result.length).to.equal(length);
};
var expectItems = function(items) {
	for (var i = 0; i < result.length; i++) {
		expect(result[i].type).to.equal(items[i].type);
	}
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

			it('should return an array containing object equivalients for each element', function() {
				expect(templateToArray('<div></div>')[0].type).to.equal('div');
				expect(templateToArray('<p></p>')[0].type).to.equal('p');
			});

		});

		describe('two sibling elements', function() {

			beforeEach(function() {
				processTpl('<div></div><p></p>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: 'p'
				}]);
			});

		});

		describe('one element nested inside another', function() {

			beforeEach(function() {
				processTpl('<div><p></p></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: 'p'
				}]);
			});

		});

		describe('sibling nested elements', function() {

			beforeEach(function() {
				processTpl('<div><p></p></div><a><span></span></a>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(4);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: 'p'
				}, {
					type: 'a'
				}, {
					type: 'span'
				}]);
			});

		});

		describe('self closing elements', function() {

			beforeEach(function() {
				processTpl('<input />');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(1);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'input'
				}]);
			});

		});

		describe('sibling self closing elements', function() {

			beforeEach(function() {
				processTpl('<input /><img />');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'input'
				}, {
					type: 'img'
				}]);
			});

		});

		describe('an element with an attribute', function() {

			beforeEach(function() {
				processTpl('<div class="test"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(1);
			});

			describe('returns an array of objects where each', function() {

				it('should have correct type', function() {
					expect(result[0].type).to.equal('div');
				});

				it('should contain an attributes hash', function() {
					expect(typeof result[0].attributes).to.equal("object");
				});

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(1);
				});

				it('should contain an attributes hash which stores the attributes as key value pairs', function() {
					expect(result[0].attributes.class).to.equal("test");
				});

			});

		});

		describe('an element with multiple attributes', function() {

			beforeEach(function() {
				processTpl('<div class="test" attribute="hello"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(1);
			});

			describe('returns an array of objects where each', function() {

				it('should have correct type', function() {
					expect(result[0].type).to.equal('div');
				});

				it('should contain an attributes hash', function() {
					expect(typeof result[0].attributes).to.equal("object");
				});

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(2);
				});

				it('should contain an attributes hash which stores the attributes as key value pairs', function() {
					expect(result[0].attributes.class).to.equal("test");
					expect(result[0].attributes.attribute).to.equal("hello");
				});

			});

		});

		describe('one placeholder', function() {

			beforeEach(function() {
				processTpl('<div>{{test}}</div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: '>',
					bind: 'test'
				}]);
			});

		});

		describe('a placeholder with capitals', function() {

			beforeEach(function() {
				processTpl('<div>{{testCapitals}}</div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: '>',
					bind: 'testCapitals'
				}]);
			});

		});

		describe('multiple placeholders', function() {

			beforeEach(function() {
				processTpl('<div>{{test}}</div><div>{{test}}<div>{{test}}</div></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(6);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: '>',
					bind: 'test'
				},{
					type: 'div'
				}, {
					type: '>',
					bind: 'test'
				},{
					type: 'div'
				}, {
					type: '>',
					bind: 'test'
				}]);
			});

		});

	});

});