'use strict';

var pkg = require('../package.json'),
should = require('should'),
_ = require('underscore');

describe('versioning', function(){
  var cache = require('..')();

  it('should have a version', function(){
    cache.should.have.property('version');
  });

  it('should equal package version', function(){
    cache.version.should.be.exactly(pkg.version);
  });
});


describe('cachy storage interface exists', function(){
  var cache = require('..')();

  var fxns = ['write', 'has', 'read', 'remove', 'clear', 'keys', 'size'];
  describe('interface has', function(){
    _.each(fxns, function(fxn){
      it(fxn + '()', function(){
	cache[fxn].should.be.a.Function;
      });
    });
  });
});
