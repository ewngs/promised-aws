'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const mime = require('mime');

const generatedMethodNames = [
    'copyObject', 'createBucket', 'deleteBucket', 'deleteBucketCors', 'deleteBucketLifecycle', 'deleteBucketPolicy',
    'deleteBucketReplication', 'deleteBucketTagging', 'deleteBucketWebsite', 'deleteObject', 'deleteObjects',
    'getBucketAcl', 'getBucketCors', 'getBucketLifecycle', 'getBucketLocation', 'getBucketLogging',
    'getBucketNotification', 'getBucketNotificationConfiguration', 'getBucketPolicy', 'getBucketReplication',
    'getBucketRequestPayment', 'getBucketTagging', 'getBucketVersioning', 'getBucketWebsite', 'getObject',
    'getObjectAcl', 'getObjectTorrent', 'getSignedUrl', 'headBucket', 'headObject', 'listBuckets', 'listMultipartUploads',
    'listObjects', 'listObjectVersions', 'listParts', 'putBucketAcl', 'putBucketCors', 'putBucketLifecycle',
    'putBucketLogging', 'putBucketNotification', 'putBucketNotificationConfiguration', 'putBucketPolicy',
    'putBucketReplication', 'putBucketRequestPayment', 'putBucketTagging', 'putBucketVersioning', 'putBucketWebsite',
    'putObject', 'putObjectAcl', 'restoreObject', 'upload', 'uploadPart', 'uploadPartCopy', 'waitFor'
];

class S3Wrapper {
    constructor(options) {
        const self = this;

        self._s3 = new AWS.S3(options);

        generatedMethodNames.forEach(function (methodName) {
            self[methodName] = function () {
                let params = Array.prototype.slice.call(arguments);
                return new Promise(function(resolve, reject) {
                    params.push(function (e, data) {
                        if (e) {
                            reject(e);
                            return;
                        }
                        resolve(data);
                    });
                    self._s3[methodName].apply(self._s3, params);
                });
            };
        });
    }

    uploadStream(inputStream, remotePath, s3Options, queueOptions) {
        const self = this;
        s3Options = s3Options || {};
        return new Promise(function(resolve, reject) {
            s3Options.Key = remotePath;
            s3Options.Body = inputStream;

            self.upload(s3Options, queueOptions)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });

    }

    uploadFile(localPath, remotePath, s3Options, queueOptions) {
        const self = this;
        s3Options = s3Options || {};
        return new Promise(function(resolve, reject) {

            let inputStream;
            try {
                inputStream = fs.createReadStream(localPath);
            } catch (e) {
                reject(e);
                return;
            }

            s3Options.ContentType = s3Options.ContentType || mime.lookup(localPath);

            self.uploadStream(inputStream, remotePath, s3Options, queueOptions)
                .then(function (data) {
                    inputStream.close();
                    resolve(data);
                })
                .catch(function (e) {
                    inputStream.close();
                    reject(e);
                });
        });
    }

    uploadFiles(files, s3Options, queueOptions) {
        const self = this;
        return Promise.all(files.map(function (uploadDef) {
            return self.uploadFile(
                uploadDef.local || uploadDef.localPath,
                uploadDef.remote || uploadDef.remotePath,
                s3Options, queueOptions);
        }));
    }

}

module.exports = S3Wrapper;
