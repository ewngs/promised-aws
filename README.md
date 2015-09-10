# High Level Promised AWS Wrapper

**WARNING: Work in progress!**

Currently implemented services:
* Simple Storage Service (S3)

## Installing

```shell
npm install promised-aws [--save]
```

## Using the S3 SDK

```javascript
const co = require('co');
const AWS = require('promised-aws').setup(globalAWSOptions);
const S3Client = AWS.S3(S3Options);

co(function* () {

    const bucketList = yield S3Client.listBuckets();
    console.log(bucketList);

});
```

All AWS.S3 methods works listed in the docs:
http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

There are these extra methods added:

* `uploadFile(localName, remoteName, s3Options, queueOptions)`
* `uploadFiles(fileNames, s3Options, queueOptions)`
    * where `fileNames = [ { local: '', remote: '' }, ...]`

`s3Options` and `queueOptions` documented here: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property

```javascript
const co = require('co');
const AWS = require('..').setup({
    accessKeyId: 'yourKeyId',
    secretAccessKey: 'yourSecret',
    region: 'eu-central-1'
});

co(function* () {

    const s3 = new AWS.S3({ params: {
        Bucket: 'asset-dev.dp.ewn.gs'
    }});

    const result = yield s3.uploadFiles([
        { local: 'test/data/01.jpg', remote: 'upload/01.jpg' },
        { local: 'test/data/02.jpg', remote: 'upload/02.jpg' }
    ], {
        ACL: 'public-read',
        StorageClass: 'REDUCED_REDUNDANCY'
    }, {
        partSize: 5 * 1024 * 1024,
        queueSize: 3
    });

    console.log(result);

}).catch(function (err) {
    console.error(err.stack);
});
```
