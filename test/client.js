'use strict';

const co = require('co');
const AWS = require('..').setup({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'eu-central-1'
});

co(function* () {

    const s3 = new AWS.S3({params: { Bucket: 'asset-dev.dp.ewn.gs' }});

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
