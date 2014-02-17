'use strict';

var async = require('async'),
fs = require('fs-extra'),
pkg = require('../package.json'),
should = require('should'),
_ = require('underscore');

describe('versioning', function(){
  var cache = require('..')({onexit : false});

  it('should have a version', function(){
    cache.should.have.property('version');
  });

  it('should equal package version', function(){
    cache.version.should.be.exactly(pkg.version);
  });
});


describe('cachy storage interface exists', function(){
  var cache = require('..')({onexit : false});

  var fxns = ['write', 'has', 'read', 'remove', 'clear', 'keys', 'size'];
  describe('interface has', function(){
    _.each(fxns, function(fxn){
      it(fxn + '()', function(){
	cache[fxn].should.be.a.Function;
      });
    });
  });
});

var filename = './.test-cache-file.json';
var time = 3000;

var data = {
  'some-number' : 123456789,
  'some-object' : {
    first : 'The first line',
    second : 'The second line',
    third : 3
  },
  'date' : (new Date()).toString(),
  'a string' : 'This is a string'
};

var keys = _.keys(data);

describe('file ops', function(){
  var cache = null;

  before(function(done){
    fs.removeSync(filename);
    cache = require('..')({
      file : filename,
      every : time,
      onexit : false});
    async.each(keys, function(key, callback){cache.write(key, data[key], callback); }, done);
  });
  
  describe('cache has key', function(){
    _.each(keys, function(key){
      it(key, function(done){
	cache.read(key, function(err, obj){
	  should(obj).be.ok;
	  obj.should.eql(data[key]);
	  return done();
	});
      });
    });
  });

  describe('wait for write', function(){
    this.timeout(time * 2);

    it('waits',function(done){
      setTimeout(done,time + (time/3));
    });
  });

  describe('wrote', function(){
    it('has file', function(done){
      fs.exists(filename, function(bool){
	bool.should.be.true;
	return done();
      });
    });
  });
  
  describe('loads from file', function(){
    cache = require('..')({
      file : filename,
      every : time,
      onexit : false}); // dont write this one out on process exit so cleanup works
    it('should have matching size', function(done){
      cache.size(function(size){
	_.size(data).should.equal(size);
	return done();
      });
    });    
  });

  describe('clearing', function(){    
    it('should remove file', function(done){
      cache.clear(function(){
	fs.exists(filename, function(bool){
	  bool.should.be.false;
	  return done();
	});
      });
    });
  });

  after(function(done){
    fs.remove(filename, done);
  });

});
