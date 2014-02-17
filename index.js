'use strict';

var pkg = require('./package.json'),
_ = require('underscore');


// xx- make read/write as functions, dont assume filesystem
module.exports = function(config){
  

  var configuration = _.defaults({}, config, {
    file : '.cache.json',
    every : 60000
  });

  var cache = require('cachy-memory')();

  return {
    write : cache.write,
    has : cache.has,
    read : cache.read,
    remove : cache.remove,
    clear : cache.clear,
    keys : cache.keys,
    size : cache.size,
    version : pkg.version
  };

};
