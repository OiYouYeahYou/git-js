'use strict';

var setup = require('./include/setup');
var sinon = require('sinon');
var TagList = require('../../src/responses/TagList');

var git, sandbox;

exports.setUp = function (done) {
   setup.restore();
   sandbox = sinon.sandbox.create();
   done();
};

exports.tearDown = function (done) {
   setup.restore();
   sandbox.restore();
   done();
};

exports.tags = {
   setUp: function setUp(done) {
      git = setup.Instance();
      done();
   },

   'with a character prefix': function withACharacterPrefix(test) {
      var tagList = TagList.parse('v1.0.0 \n v0.0.1 \n v0.6.2');

      test.equals('v1.0.0', tagList.latest);
      test.same(['v0.0.1', 'v0.6.2', 'v1.0.0'], tagList.all);

      test.done();
   },

   'with a character prefix and different lengths': function withACharacterPrefixAndDifferentLengths(test) {
      var tagList = TagList.parse('v1.0 \n v1.0.1');

      test.equals('v1.0.1', tagList.latest);
      test.same(['v1.0', 'v1.0.1'], tagList.all);

      test.done();
   },

   'with max count shorthand property': function withMaxCountShorthandProperty(test) {
      git.tags(function (err, result) {
         test.equals(null, err, 'not an error');
         test.same(["tag", "-l"], setup.theCommandRun());
         test.equals('1.2.1', result.latest);
         test.same(['0.1.1', '1.1.1', '1.2.1'], result.all);

         test.done();
      });

      setup.closeWith('0.1.1\n\
        1.2.1\n\
        1.1.1\
        ');
   },

   'removes empty lines': function removesEmptyLines(test) {
      git.tags(function (err, result) {
         test.equals(null, err, 'not an error');
         test.same(["tag", "-l"], setup.theCommandRun());
         test.equals('1.10.0', result.latest);
         test.same(['0.1.0', '0.2.0', '0.10.0', '0.10.1', '1.10.0', 'tagged'], result.all);

         test.done();
      });

      setup.closeWith('\n\
    0.1.0\n\
    0.10.0\n\
    0.10.1\n\
    0.2.0\n\
    1.10.0\n\
    tagged\n\
');
   },

   'respects a custom sort order': function respectsACustomSortOrder(test) {
      git.tags({ '--sort': 'foo' }, function (err, result) {
         test.equals(null, err, 'not an error');
         test.same(["tag", "-l", "--sort=foo"], setup.theCommandRun());
         test.equals('aaa', result.latest);
         test.same(['aaa', '0.10.0', '0.2.0', 'bbb'], result.all);

         test.done();
      });

      setup.closeWith('\n\
    aaa\n\
    0.10.0\n\
    0.2.0\n\
    bbb\n\
');
   }
};