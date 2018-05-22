'use strict';

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

var Test = require('./include/runner');

var setUp = function setUp(context) {
   return context.gitP(context.root).init();
};

var test = function test(context, assert) {

   var first = context.git(context.root);
   var second = context.git(context.root);

   var results = [];

   var promises = [new _Promise(function (done) {
      first.status(function (err) {
         results.push('first:a');
         assert.equal(err, null, 'Should not be an error');
         done();
      });
   }), new _Promise(function (done) {
      second.status(function (err) {
         results.push('second:a');
         assert.equal(err, null, 'Should not be an error');
         done();
      });
   }), new _Promise(function (done) {
      first.status(function (err) {
         results.push('first:b');
         assert.equal(err, null, 'Should not be an error');
         done();
      });
   }), new _Promise(function (done) {
      setTimeout(function () {
         first.status(function (err) {
            results.push('first:c');
            assert.equal(err, null, 'Should not be an error');
            done();
         });
      }, 1000);
   })];

   return new _Promise(function (done) {

      var assertAllProcessesCompleted = function assertAllProcessesCompleted() {
         assert.equal(results.sort().join(' '), 'first:a first:b first:c second:a', 'Should have handled each process');
      };

      var timeout = setTimeout(assertAllProcessesCompleted, 2000);

      _Promise.all(promises).then(function () {
         clearTimeout(timeout);
         assertAllProcessesCompleted();
         done();
      });
   });
};

module.exports = new Test(setUp, test);