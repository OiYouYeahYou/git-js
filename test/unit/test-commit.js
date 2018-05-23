'use strict';

var setup = require('./include/setup');
var sinon = require('sinon');

var git, sandbox;
var theCommandRun = setup.theCommandRun,
   closeWith = setup.closeWith,
   Instance = setup.Instance;


var CommitSummary = require('../../src/responses/CommitSummary');

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

exports.commit = {
   setUp: function setUp(done) {
      git = Instance();
      done();
   },

   'commit with an author set': function commitWithAnAuthorSet(test) {
      git.commit('some message', 'fileName.ext', { '--author': '"Some Author <some@author.com>"' }, function (err, summary) {
         test.same(['commit', '-m', 'some message', 'fileName.ext', '--author="Some Author <some@author.com>"'], theCommandRun());

         test.deepEqual(summary.author, {
            email: 'some@author.com',
            name: 'Some Author'
         });

         test.done();
      });

      closeWith('\n\n[foo 8f7d107] done\nAuthor: Some Author <some@author.com>\n1 files changed, 2 deletions(-)\n\n      ');
   },

   'commit with single file specified': function commitWithSingleFileSpecified(test) {
      git.commit('some message', 'fileName.ext', function (err, commit) {
         test.equals('unitTests', commit.branch, 'Should be on unitTests branch');
         test.equals('44de1ee', commit.commit, 'Should pick up commit hash');
         test.equals(3, commit.summary.changes, 'Should pick up changes count');
         test.equals(12, commit.summary.deletions, 'Should pick up deletions count');
         test.equals(29, commit.summary.insertions, 'Should pick up insertions count');

         test.same(['commit', '-m', 'some message', 'fileName.ext'], theCommandRun());

         test.done();
      });

      closeWith('[unitTests 44de1ee] Add nodeunit test runner\n\
        3 files changed, 29 insertions(+), 12 deletions(-)\n\
        create mode 100644 src/index.js');
   },

   'commit with single file specified and multiple line commit': function commitWithSingleFileSpecifiedAndMultipleLineCommit(test) {
      git.commit(['some', 'message'], 'fileName.ext', function (err, commit) {
         test.equals('unitTests', commit.branch, 'Should be on unitTests branch');
         test.equals('44de1ee', commit.commit, 'Should pick up commit hash');
         test.equals(3, commit.summary.changes, 'Should pick up changes count');
         test.equals(12, commit.summary.deletions, 'Should pick up deletions count');
         test.equals(29, commit.summary.insertions, 'Should pick up insertions count');

         test.same(['commit', '-m', 'some', '-m', 'message', 'fileName.ext'], theCommandRun());

         test.done();
      });

      closeWith('[unitTests 44de1ee] Add nodeunit test runner\n\
        3 files changed, 29 insertions(+), 12 deletions(-)\n\
        create mode 100644 src/index.js');
   },

   'commit with multiple files specified': function commitWithMultipleFilesSpecified(test) {
      git.commit('some message', ['fileName.ext', 'anotherFile.ext'], function (err, commit) {

         test.equals('branchNameInHere', commit.branch, 'Should pick up branch name');
         test.equals('CommitHash', commit.commit, 'Should pick up commit hash');
         test.equals(3, commit.summary.changes, 'Should pick up changes count');
         test.equals(12, commit.summary.deletions, 'Should pick up deletions count');
         test.equals(29, commit.summary.insertions, 'Should pick up insertions count');

         test.same(['commit', '-m', 'some message', 'fileName.ext', 'anotherFile.ext'], theCommandRun());

         test.done();
      });

      closeWith('[branchNameInHere CommitHash] Add nodeunit test runner\n\
        3 files changed, 29 insertions(+), 12 deletions(-)\n\
        create mode 100644 src/index.js');
   },

   'commit with multiple files specified and multiple line commit': function commitWithMultipleFilesSpecifiedAndMultipleLineCommit(test) {
      git.commit(['some', 'message'], ['fileName.ext', 'anotherFile.ext'], function (err, commit) {

         test.equals('branchNameInHere', commit.branch, 'Should pick up branch name');
         test.equals('CommitHash', commit.commit, 'Should pick up commit hash');
         test.equals(3, commit.summary.changes, 'Should pick up changes count');
         test.equals(12, commit.summary.deletions, 'Should pick up deletions count');
         test.equals(29, commit.summary.insertions, 'Should pick up insertions count');

         test.same(['commit', '-m', 'some', '-m', 'message', 'fileName.ext', 'anotherFile.ext'], theCommandRun());

         test.done();
      });

      closeWith('[branchNameInHere CommitHash] Add nodeunit test runner\n\
        3 files changed, 29 insertions(+), 12 deletions(-)\n\
        create mode 100644 src/index.js');
   },

   'commit with no files specified': function commitWithNoFilesSpecified(test) {
      git.commit('some message', function (err, commit) {

         test.equals('branchNameInHere', commit.branch, 'Should pick up branch name');
         test.equals('CommitHash', commit.commit, 'Should pick up commit hash');
         test.equals(3, commit.summary.changes, 'Should pick up changes count');
         test.equals(12, commit.summary.deletions, 'Should pick up deletions count');
         test.equals(10, commit.summary.insertions, 'Should pick up insertions count');

         test.same(['commit', '-m', 'some message'], theCommandRun());

         test.done();
      });

      closeWith('[branchNameInHere CommitHash] Add nodeunit test runner\n\
        3 files changed, 10 insertions(+), 12 deletions(-)\n\
        create mode 100644 src/index.js');
   },

   'commit with no files specified and multiple line commit': function commitWithNoFilesSpecifiedAndMultipleLineCommit(test) {
      git.commit(['some', 'message'], function (err, commit) {

         test.equals('branchNameInHere', commit.branch, 'Should pick up branch name');
         test.equals('CommitHash', commit.commit, 'Should pick up commit hash');
         test.equals(3, commit.summary.changes, 'Should pick up changes count');
         test.equals(12, commit.summary.deletions, 'Should pick up deletions count');
         test.equals(10, commit.summary.insertions, 'Should pick up insertions count');

         test.same(['commit', '-m', 'some', '-m', 'message'], theCommandRun());

         test.done();
      });

      closeWith('[branchNameInHere CommitHash] Add nodeunit test runner\n\
        3 files changed, 10 insertions(+), 12 deletions(-)\n\
        create mode 100644 src/index.js');
   },

   'commit when no files are staged': function commitWhenNoFilesAreStaged(test) {
      git.commit('some message', function (err, commit) {

         test.equals('', commit.branch, 'Should pick up branch name');
         test.equals('', commit.commit, 'Should pick up commit hash');
         test.equals(0, commit.summary.changes, 'Should pick up changes count');
         test.equals(0, commit.summary.deletions, 'Should pick up deletions count');
         test.equals(0, commit.summary.insertions, 'Should pick up insertions count');

         test.done();
      });

      closeWith('On branch master\n\
        Your branch is ahead of \'origin/master\' by 1 commit.\n\
           (use "git push" to publish your local commits)\n\n\
        Changes not staged for commit:\n\
        modified:   src/some-file.js\n\
        modified:   src/another-file.js\n\n\
        no changes added to commit\n\
        ');
   },

   'commit summary': function commitSummary(test) {
      var commitSummary = CommitSummary.parse('\n\n[branchNameInHere CommitHash] Add nodeunit test runner\n3 files changed, 10 insertions(+), 12 deletions(-)\ncreate mode 100644 src/index.js\n        \n      ');

      test.equal(null, commitSummary.author, 'Should not have author detail when not set in the commit');
      test.equal(12, commitSummary.summary.deletions);
      test.equal(10, commitSummary.summary.insertions);
      test.equal(3, commitSummary.summary.changes);
      test.done();
   },

   'commit summary with author data': function commitSummaryWithAuthorData(test) {
      var commitSummary = CommitSummary.parse('\n\n[branchNameInHere CommitHash] Add nodeunit test runner\nAuthor: Some One <some@one.com>\n3 files changed, 10 insertions(+), 12 deletions(-)\ncreate mode 100644 src/index.js\n        \n      ');

      test.deepEqual({ name: 'Some One', email: 'some@one.com' }, commitSummary.author, 'Should not have author detail when not set in the commit');
      test.equal(12, commitSummary.summary.deletions);
      test.equal(10, commitSummary.summary.insertions);
      test.equal(3, commitSummary.summary.changes);
      test.done();
   }
};