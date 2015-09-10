'use strict';

const AWS = require('aws-sdk');

let exported = module.exports = {
    S3: require('./lib/s3'),

    setup(obj) {
        AWS.config.update(obj);
        return exported;
    },

    get config() {
        return AWS.config;
    }
};
