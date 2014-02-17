'use strict';

var fs = require('fs-extra'),
pkg = require('./package.json'),
_ = require('underscore');


// xx- make read/write as functions, dont assume filesystem
module.exports = function(config){
  

  var configuration = _.defaults({}, config, {
    file : './.cache.json',
    every : 60000
  });

  var cache = require('cachy-memory')();

  // on startup, load
  if(fs.existsSync(configuration.file)){
    var saved = fs.readJsonSync(configuration.file);
    if(saved) cache.load(saved);
    else throw new Error('Unable to load existing cache data @ ' + configuration.file);
  }

  var write = _.throttle(function(callback){
    fs.writeJson(configuration.file, cache.get(), callback);
  }, configuration.every);

  var intervalID = setInterval(write, configuration.every);
  intervalID.unref();

  var clean = _.partial(fs.removeSync,configuration.file);

 // xx - on shutdown, write

 // xx- wrap in operation counter/flag, only write if diff
  return {
    write : cache.write,
    has : cache.has,
    read : cache.read,
    remove : cache.remove,
    clear : function(callback){
      clean();
      return cache.clear(callback);
    },
    keys : cache.keys,
    size : cache.size,
    version : pkg.version
  };

};
