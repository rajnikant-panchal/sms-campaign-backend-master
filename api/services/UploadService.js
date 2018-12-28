var request = require('request');
var q = require('q');
var fs = require('fs');
var async = require('async');

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAJM6PTSKXSW4Y7GXQ";
AWS.config.secretAccessKey = "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";

var mime = require('mime');
var s3 = new AWS.S3({signatureVersion: 'v4'});

module.exports = {

  attributes: {

  },
  resizeAndUpload: function(modelObj, filePath, modelName, multipleResolutions, uploadFileName){
    var defer = q.defer();
    var success_count = 0;
    var failure_count = 0;
    async.each(multipleResolutions,function(resolutionObj,callbackmain){
      gm(filePath)
      .resize(resolutionObj.width,resolutionObj.height)
      .noProfile()
      .stream(function(err, stdout, stderr) {
        var buf = new Buffer('');
          stdout.on('data', function(data) {
             buf = Buffer.concat([buf, data]);
          });
          stdout.on('end', function(data) {
            var data1 = {
                Bucket: "sms-messenger-files",
                Key: modelName+'/'+modelObj.id+'/'+resolutionObj.prefix+'_'+uploadFileName,
                ACL: 'public-read',
                Body: buf,
                ContentType: mime.lookup(uploadFileName)
            };
            s3.putObject(data1, function(err, rese) {
              if(!err) success_count++;
              if(err) failure_count++;
              callbackmain();
            });
          });
        });
    },function(){
      var ret_obj = {
        success_count: success_count,
        failure_count: failure_count
      };
      defer.resolve(ret_obj);
    });
    return defer.promise;
  },
  uploadFile: function(modelObj, filePath, modelName, uploadFileName){
    var defer = q.defer();
    var stdout = fs.createReadStream(filePath);
    var buf = new Buffer('');
    stdout.on('data', function(data) {
       buf = Buffer.concat([buf, data]);
    });
    stdout.on('end', function(data) {
      var data1 = {
          Bucket: "sms-messenger-files",
          Key: modelName+'/'+modelObj.id+'/'+uploadFileName,
          ACL: 'public-read',
          Body: buf,
          ContentType: mime.lookup(uploadFileName)
      };
      s3.putObject(data1, function(err, rese) {
        console.log('rese', rese);
        console.log('err', err);
        if(!err) defer.resolve(rese);
        if(err) defer.reject(err);
      });
    });
    return defer.promise;
  },
  uploadExcelFile: function(modelObj, filePath, modelName, uploadFileName){
    var defer = q.defer();
    var stdout = fs.createReadStream(filePath);
    var buf = new Buffer('');
    stdout.on('data', function(data) {
       buf = Buffer.concat([buf, data]);
    });
    stdout.on('end', function(data) {
      var data1 = {
          Bucket: "sms-messenger-files",
          Key: modelName+'/'+modelObj.id+'/'+uploadFileName,
          ACL: 'public-read',
          Body: buf,
          ContentType: mime.lookup(uploadFileName)
      };
      s3.putObject(data1, function(err, rese) {
        if(!err) defer.resolve(rese);
        if(err) defer.reject(err);
      });
    });
    return defer.promise;
  }

};
